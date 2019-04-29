import { View } from "../view";
import "./gameView.css";
import { Game } from "../../game/game";

const canvasElementId = "gameCanvas";

export class GameView extends View {
    private game: Game;

    public render(): HTMLElement {
        const canvasWrapper = document.createElement("div");
        canvasWrapper.id = "canvaswrapper";
        const canvasElement = document.createElement("canvas");
        canvasElement.id = canvasElementId;
        canvasWrapper.append(canvasElement);
        return canvasWrapper;
    }

    public onMounted(): void {
        console.log("[gameView - onMounted] Booting game");
        this.game = new Game(canvasElementId);
        this.game.load();
    }

    public dispose(): void {
        console.log("[gameView - dispose] Disposing gameview");
        this.game.dispose();
    }
}
