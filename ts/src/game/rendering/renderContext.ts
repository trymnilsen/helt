import { Camera } from "./camera";

export interface RenderContext {
    camera: Camera;
    canvas: CanvasRenderingContext2D;
}
