const MaxRectsPacker = require("maxrects-packer").MaxRectsPacker;
const fs = require("fs");
const sizeOf = require("image-size");
const path = require("path");
const performance = require("perf_hooks").performance;
const { loadImage, createCanvas } = require("canvas");
/**
 * Validates metadata object
 * @param {Object} metadata content of a asset metadata file, check <repo>/assets/readme.md for format
 */
function validateMetadata(metadata) {
    if (!metadata) {
        throw new Error("No metadata defined");
    }
    if (!!metadata.origin) {
        if (!typeof metadata.origin === "object") {
            throw new Error("origin not an object");
        }
        if (
            metadata.origin["x"] === undefined ||
            typeof metadata.origin.x !== "number"
        ) {
            throw new Error("origin requires an X number field");
        }
        if (
            metadata.origin["y"] === undefined ||
            typeof metadata.origin.y !== "number"
        ) {
            throw new Error("origin requires an Y number field");
        }
    }
}
/**
 * Validate if all bins does not contain any oversized items
 * @param {array} bins array of bins to validate
 */
function validateBins(bins) {
    bins.forEach((bin) => {
        bin.rects.forEach((rect) => {
            if (!!rect.oversized) {
                throw new Error("Oversized asset: " + rect.data.id);
            }
        });
    });
}
/**
 * reads the png and optional json file for each supplied filepath entry in array
 * @param {array} files array of filepaths as string to load
 */
function getAssetData(files) {
    const data = {};
    files
        .filter((file) => file.endsWith(".png"))
        .forEach((file) => {
            const imageDimensions = sizeOf(file);
            const filenameWithoutExt = file.substring(0, file.length - 4);
            const metadataFile = filenameWithoutExt + ".json";
            const dataEntry = {
                width: imageDimensions.width,
                height: imageDimensions.height,
                id: path.basename(filenameWithoutExt, ".png"),
                file: file
            };
            const includeMetadata = fs.existsSync(metadataFile);
            if (includeMetadata) {
                const metadataContent = fs
                    .readFileSync(metadataFile)
                    .toString("utf-8");
                const json = JSON.parse(metadataContent);
                try {
                    validateMetadata(json);
                } catch (err) {
                    console.error(
                        `[Error] Invalid metadata for ${metadataFile}`,
                        err
                    );
                    process.exit(1);
                }
                dataEntry.metadata = json;
            }
            if (!!data[filenameWithoutExt]) {
                throw new Error("Duplicate files: " + filenameWithoutExt);
            }
            data[filenameWithoutExt] = dataEntry;
            console.log(
                `[Info] loaded file: ${filenameWithoutExt} metadata: ${
                    includeMetadata ? "true" : "false"
                }`
            );
        });
    return data;
}

/**
 * Packs the assets into bin(s)
 * @param {Object} assetData object of asset data loaded by getAssetData
 */
function pack(assetData) {
    const packInput = Object.values(assetData).map((data) => {
        return {
            width: data.width,
            height: data.height,
            data: {
                id: data.id,
                metadata: data.metadata,
                file: data.file
            }
        };
    });
    const packOptions = {
        smart: true,
        pot: false,
        square: false
    };
    const packer = new MaxRectsPacker(1024, 1024, 0, packOptions);
    packer.addArray(packInput);
    validateBins(packer.bins);
    console.log("[info] packed, number of bins: ", packer.bins.length);
    return packer.bins;
}

function getBinName(binNum) {
    return "bin" + binNum;
}

async function drawBin(bin, name) {
    console.log("[info] drawing bin: " + name);
    const canvas = createCanvas(bin.width, bin.height);
    const canvasContext = canvas.getContext("2d");
    for (let i = 0; i < bin.rects.length; i++) {
        const rect = bin.rects[i];
        const image = await loadImage(rect.data.file);
        canvasContext.drawImage(image, rect.x, rect.y, rect.width, rect.height);
    }
    const out = fs.createWriteStream(
        path.join(process.cwd(), "public", "dist", "img", name + ".png")
    );
    const stream = canvas.createPNGStream();
    const pipeCompletion = new Promise((resolve, reject) => {
        out.on("error", reject);
        out.on("finish", resolve);
    });
    stream.pipe(out);
    await pipeCompletion;
    console.log("[info] written bin: " + name + ".png");
}

function getBinDefintion(bins) {
    const defintion = {
        bins: {},
        resources: {}
    };
    for (let i = 0; i < bins.length; i++) {
        const bin = bins[i];
        const binName = getBinName(i);
        defintion.bins[binName] = `${binName}.png`;
        for (let j = 0; j < bin.rects.length; j++) {
            const rect = bin.rects[j];
            defintion.resources[rect.data.id] = {
                id: rect.data.id,
                bin: binName,
                origin: !!rect.data.metadata ? rect.data.metadata.origin : {},
                binPosition: {
                    x: rect.x,
                    y: rect.y,
                    w: rect.width,
                    h: rect.height
                }
            };
        }
    }
    return defintion;
}
function generateResourceFile(binDefintion) {
    //header
    const header =
        "//This file was generated by a tool " +
        new Date().toISOString() +
        ", any changes will be overwritten" +
        "read readme.md in /assets folder on how to update this file";
    const binMapInterface =
        "export interface BinMap { [key: string]: string; }";
    //Generate bins code
    const binFields = Object.entries(binDefintion.bins)
        .map((entry) => `${entry[0]}:"${entry[1]}"`)
        .join("\n,");
    const binsExport = `export const bins: BinMap = { ${binFields} };`;
    //Generate a string literal of all assets
    const assetLiteralItems = Object.keys(binDefintion.resources)
        .map((item) => `"${item}"`)
        .join("\n    |");
    const assetLiteral = `export type AssetId = ${assetLiteralItems};`;
    //Generate constant variable of asset data
    const variableContent = JSON.stringify(binDefintion.resources, null, 4);
    const variableDefintion = `export const resources = ${variableContent};`;
    //Final file content
    const fileContent = `${header}\n${binMapInterface}\n\n${binsExport}\n\n${assetLiteral}\n\n${variableDefintion}`;
    //Write the content to file
    fs.writeFileSync(
        path.join(process.cwd(), "ts", "src", "asset", "assets.generated.ts"),
        fileContent
    );
}

async function run() {
    /**
     *     #### ENTRY POINT ####
     */
    const startTime = performance.now();
    const files = fs.readdirSync(path.join(process.cwd(), "assets"));
    const assetData = getAssetData(
        files.map((file) => path.join(process.cwd(), "assets", file))
    );
    if (Object.keys(assetData).length == 0) {
        console.warn("[Warn] No valid asset files found");
        process.exit(0);
    }

    const bins = pack(assetData);
    for (let i = 0; i < bins.length; i++) {
        const bin = bins[i];
        await drawBin(bin, getBinName(i));
    }
    const binDefintion = getBinDefintion(bins);
    generateResourceFile(binDefintion);
    const endTime = performance.now();
    console.log(
        "[Info] Finished packing, used: " +
            (endTime - startTime).toFixed(2) +
            "ms"
    );
}

run();
