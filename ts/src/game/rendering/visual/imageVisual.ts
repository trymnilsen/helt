import { RenderNode, NodeConfiguration } from "../renderNode";
import { Camera } from "../camera";
import { RenderContext } from "../renderContext";
import { AssetId, resources } from "../../../asset/assets.generated";

export interface ImageConfiguration extends NodeConfiguration {
    width?: number;
    height?: number;
    image: AssetId;
}

export class ImageVisual extends RenderNode {
    private config: ImageConfiguration;
    public constructor(config: ImageConfiguration) {
        super(config);
        this.config = config;
    }
    public render(context: RenderContext): void {
        const image = context.assetCache.getBin(this.config.image);
        const imageData = resources[this.config.image];
        let rx = this.absolutePosition.x + context.camera.position.x;
        let ry = this.absolutePosition.y + context.camera.position.y;
        let rw = this.config.width || imageData.binPosition.w;
        let rh = this.config.height || imageData.binPosition.h;
        context.canvas.drawImage(
            image,
            imageData.binPosition.x,
            imageData.binPosition.y,
            imageData.binPosition.w,
            imageData.binPosition.h,
            rx,
            ry,
            rw,
            rh
        );
    }
}
