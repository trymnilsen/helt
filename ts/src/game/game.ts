import { Renderer } from "./rendering/renderer";
import { JsonTree } from "../storage/jsonNode";
import { GameSceneHandler } from "./gameScene";
import { WorldSceneName, WorldScene } from "./scene/world/worldScene";
import { AssetCache } from "./rendering/assetCache";

export class Game {
    private renderer: Renderer;
    private state: JsonTree;
    private gameSceneHandler: GameSceneHandler;
    private assetCache: AssetCache;
    public constructor(canvasElementId: string) {
        this.assetCache = new AssetCache();
        this.renderer = new Renderer(canvasElementId, this.assetCache);
        this.state = new JsonTree();
        this.gameSceneHandler = new GameSceneHandler();
        this.gameSceneHandler.registerScene(
            WorldSceneName,
            new WorldScene(this.renderer.rootNode, this.state)
        );
        this.gameSceneHandler.transition(WorldSceneName);
    }
    public load() {
        return this.assetCache.load(["/asset/img/grass_tile4x.png"]);
    }
    public dispose() {}
}
