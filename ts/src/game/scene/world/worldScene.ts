import { EventHandle } from "../../../event/event";
import { RenderNode } from "../../rendering/renderNode";
import { JsonTree } from "../../../storage/jsonNode";
import { GameScene } from "../../gameScene";

export const WorldSceneName = "world";
export class WorldScene implements GameScene {
    private state: JsonTree;
    private stateHandle: EventHandle;
    private rootRenderNode: RenderNode;
    public constructor(rootNode: RenderNode, state: JsonTree) {
        this.rootRenderNode = rootNode;
        this.state = state;
    }
    public transitionTo(): void {}
    public dispose(): void {
        console.log("[worldscene - dispose] disposing");
        this.stateHandle();
    }
}
