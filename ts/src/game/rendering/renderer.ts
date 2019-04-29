import { RenderNode } from "./renderNode";
import { Event } from "../../event/event";
import { RenderContext } from "./renderContext";
import { Camera } from "./camera";
import { rgbToHex } from "../../color";
import { AssetCache } from "./assetCache";
export class Renderer {
    public onRender: Event<any>;

    private canvasContext: CanvasRenderingContext2D;
    private _rootNode: RenderNode;
    private renderContext: RenderContext;
    public constructor(canvasElementId: string, assetCache: AssetCache) {
        const canvasElement: HTMLCanvasElement = document.querySelector(
            `#${canvasElementId}`
        );
        if (!canvasElement) {
            throw new Error(`Canvas element ${canvasElementId} not found`);
        }
        window.addEventListener(
            "[renderer - onResize] resize triggered",
            () => {
                this.onResize();
            }
        );
        window.addEventListener("keypress", (event) => {
            if (event.key == "r") {
                console.log("[renderer - keypress] Manual render trigger");
                this.render();
            }
        });
        this.onRender = new Event();
        this.canvasContext = canvasElement.getContext("2d");
        this.canvasContext.canvas.width = window.innerWidth;
        this.canvasContext.canvas.height = window.innerHeight;
        this.renderContext = {
            canvas: this.canvasContext,
            camera: new Camera()
        };
        this._rootNode = new RenderNode();
    }

    public render() {
        const startTime = performance.now();
        this.onRender.publish({});
        this._rootNode.updateTransform(null);
        //Traverse nodes add to list, breadth first
        const renderList = this.prepareRenderList();
        //Clear screen
        this.clearScreen();
        //run render method on each entry
        this.renderItems(renderList);
        const endTime = performance.now();
        console.log(
            "[renderer - render] Render time: " + (endTime - startTime)
        );
    }

    private renderItems(renderList: RenderNode[]) {
        for (let index = 0; index < renderList.length; index++) {
            const element = renderList[index];
            element.render(this.renderContext);
        }
    }

    private clearScreen() {
        this.canvasContext.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );
        this.canvasContext.fillStyle = rgbToHex(0, 50, 20);
        this.canvasContext.fillRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );
    }

    public get rootNode(): RenderNode {
        return this._rootNode;
    }
    private onResize() {
        this.canvasContext.canvas.width = window.innerWidth;
        this.canvasContext.canvas.height = window.innerHeight;
        this.render();
    }
    private prepareRenderList() {
        const renderList = [];

        const queue = [this._rootNode];

        while (queue.length > 0) {
            const node = queue.shift();
            renderList.push(node);
            if (!node.children || node.children.length < 1) {
                continue;
            }

            for (let i = 0; i < node.children.length; i++) {
                queue.push(node.children[i]);
            }
        }

        renderList.sort(function(a, b) {
            if (a.depth < b.depth) return -1;
            if (a.depth > b.depth) return 1;
            return 0;
        });
        return renderList;
    }
}
