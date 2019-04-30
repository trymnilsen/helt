import { Event } from "../event/event";
import { AssetId, bins, resources } from "./assets.generated";

export interface AssetLoadProgressEvent {
    current: number;
    total: number;
}

export type AssetsLoadedCallback = () => void;
export class AssetCache {
    private bins: { [id: string]: HTMLImageElement };
    public constructor() {
        this.bins = {};
    }
    public async load() {
        const loadStart = performance.now();
        const loadPromises: Promise<void>[] = [];
        for (const binId in bins) {
            if (bins.hasOwnProperty(binId)) {
                const binUrl: string = bins[binId];
                const image = new Image();
                loadPromises.push(
                    new Promise((resolve, reject) => {
                        image.onerror = reject;
                        image.onload = () => {
                            this.bins[binId] = image;
                            console.log(
                                "[assetcache - load] - Loaded bin: " + binId
                            );
                            resolve();
                        };
                    })
                );
                image.src = `/dist/img/${binUrl}`;
            }
        }
        const allBins = Promise.all(loadPromises);
        await allBins;
        const loadEnd = performance.now();
        console.log("[assetcache - load] load used ", loadEnd - loadStart);
    }
    public getBin(asset: AssetId): HTMLImageElement {
        const bin = resources[asset].bin;
        return this.bins[bin];
    }
}
