export interface GameScene {
    transitionTo(): void;
    dispose(): void;
}

export interface GameSceneChanger {
    transition(toName: string): void;
}
export class GameSceneHandler implements GameSceneChanger {
    private scenes: { [name: string]: GameScene } = {};
    private _currentScene: GameScene;

    public constructor() {}

    public registerScene(name: string, scene: GameScene) {
        this.scenes[name] = scene;
    }

    public transition(toName: string) {
        const newScene = this.scenes[toName];
        if (!newScene) {
            throw new Error("Invalid scene name, cannot transition");
        }
        if (!!this._currentScene) {
            this._currentScene.dispose();
        }
        newScene.transitionTo();
        this._currentScene = newScene;
    }

    public disposeAllScenes(): void {
        Object.values(this.scenes).forEach((scene) => scene.dispose());
    }

    public get currentGameScene(): GameScene {
        return this._currentScene;
    }
}
