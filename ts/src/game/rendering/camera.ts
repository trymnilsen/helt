import { Point } from "../../structure/point";

export class Camera {
    public position: Point;
    public constructor() {
        this.position = { x: 0, y: 0 };
    }
}
