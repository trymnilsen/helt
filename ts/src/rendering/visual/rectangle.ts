import { RenderNode, NodeConfiguration } from "./renderNode";
import { RenderContext } from "../renderContext";
import { Camera } from "../camera";

export interface RectangleConfiguration extends NodeConfiguration {
    width: number;
    height: number;
    color: string;
    strokeWidth?: number;
    strokeColor?: string;
}

export class Rectangle extends RenderNode {
    private config: RectangleConfiguration;
    public constructor(config: RectangleConfiguration) {
        super(config);
        this.config = config;
    }
    public render(context: CanvasRenderingContext2D, camera: Camera): void {
        let rx = this.absolutePosition.x + camera.position.x;
        let ry = this.absolutePosition.y + camera.position.y;
        let rw = this.config.width;
        let rh = this.config.height;
        //Handle stroke if defined
        if (this.config.strokeWidth > 0) {
            //Reduce the size and position of our fill rectangle
            //by the double of or stroke size (one for each side)
            rx += this.config.strokeWidth;
            ry += this.config.strokeWidth;
            rw -= this.config.strokeWidth * 2;
            rh -= this.config.strokeWidth * 2;
            //Create the stroke (which is actually a larger rectangle drawn
            //behind our fill rectangle)
            const color = this.config.strokeColor || "black";
            context.fillStyle = color;
            context.fillRect(
                this.absolutePosition.x + camera.position.x,
                this.absolutePosition.y + camera.position.y,
                this.config.width,
                this.config.height
            );
        }
        context.fillStyle = this.config.color;
        context.fillRect(rx, ry, rw, rh);
    }
}
