import { Camera } from "./camera";
import { AssetCache } from "../../asset/assetCache";

export interface RenderContext {
    camera: Camera;
    canvas: CanvasRenderingContext2D;
    assetCache: AssetCache;
}
