import { EventHandle } from "../../../event/event";
import { RenderNode } from "../../rendering/renderNode";
import { JsonTree } from "../../../storage/jsonNode";
import { GameScene } from "../../gameScene";
import { ImageVisual } from "../../rendering/visual/imageVisual";

export const WorldSceneName = "world";
export class WorldScene implements GameScene {
    private state: JsonTree;
    private stateHandle: EventHandle;
    private rootRenderNode: RenderNode;
    public constructor(rootNode: RenderNode, state: JsonTree) {
        this.rootRenderNode = rootNode;
        this.state = state;
        const testImage = new ImageVisual({
            x: 200,
            y: 200,
            image: "grass_tile4x"
        });
        this.rootRenderNode.addChild(testImage);
    }
    public transitionTo(): void {}
    public dispose(): void {
        console.log("[worldscene - dispose] disposing");
        this.stateHandle();
    }
}
