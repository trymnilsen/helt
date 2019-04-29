import { Point, addPoint } from "../../structure/point";
import { RenderContext } from "./renderContext";

export interface NodeConfiguration {
    x: number;
    y: number;
    depth?: number;
}

export class RenderNode {
    public position: Point;
    public depth: number;
    public parent: RenderNode;
    private _absolutePosition: Point;
    private _children: RenderNode[] = [];
    public constructor(nodeConfig?: NodeConfiguration) {
        this.depth = 0;
        this.position = { x: 0, y: 0 };
        if (!!nodeConfig) {
            this.position = { x: nodeConfig.x, y: nodeConfig.y };
            this.depth = nodeConfig.depth || this.depth;
        }
    }
    public render(context: RenderContext): void {}
    public addChild(child: RenderNode) {
        this._children.push(child);
        child.parent = this;
    }
    public removeChild(childToRemove: RenderNode) {
        const childIndex = this._children.findIndex((child) => {
            return child === childToRemove;
        });
        if (childIndex === -1) {
            console.warn(
                "[rendernode - removechild] cannot remove child not found in children"
            );
        }
        this._children.splice(childIndex, 1);
    }

    public get children(): Readonly<RenderNode[]> {
        return this._children;
    }
    public get absolutePosition(): Readonly<Point> {
        return this._absolutePosition;
    }
    public updateTransform(parentPoint: Point) {
        if (!parentPoint) {
            //No parent, use zero
            parentPoint = { x: 0, y: 0 };
        }
        this._absolutePosition = addPoint(parentPoint, this.position);
        for (let i = 0; i < this._children.length; i++) {
            this._children[i].updateTransform(this._absolutePosition);
        }
    }
    public setPosition(newPosition: Point) {
        this.position = newPosition;
    }
    public remove() {
        if (!!this.parent) {
            this.parent.removeChild(this);
        } else {
            throw new Error("Cannot remove node with no parent");
        }
    }
}
