import { Event } from "../../event/event";

export interface AssetLoadProgressEvent {
    current: number;
    total: number;
}

export type AssetsLoadedCallback = () => void;
export class AssetCache {
    private assets: { [id: string]: HTMLImageElement };
    public constructor() {
        this.assets = {};
    }
    public async load(urls: string[]) {
        const loadStart = performance.now();
        const promisses: Promise<HTMLImageElement>[] = [];
        urls.forEach((asset) => {
            const element = new Image();
            promisses.push(
                new Promise<HTMLImageElement>((resolve, reject) => {
                    element.onload = () => {
                        this.assets[asset] = element;
                        console.log("[assetcache - load] loaded asset", asset);
                        resolve(element);
                    };
                    element.onerror = reject;
                })
            );
            element.src = asset;
        });
        await Promise.all(promisses);
        const loadEnd = performance.now();
        console.log("[assetcache - load] load used ", loadEnd - loadStart);
    }
    public get(url: string): HTMLImageElement {
        if (!this.assets) {
            throw new Error(
                "Asset not found you need to load it first: " + url
            );
        }
        return this.assets[url];
    }
}
