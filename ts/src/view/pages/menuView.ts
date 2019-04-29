import { View } from "../view";
import "./menuView.css";

export class MenuView extends View {
    public render(): HTMLElement {
        const buttonContainer = document.createElement("div");
        buttonContainer.id = "button-container";
        const playButton = document.createElement("a");
        playButton.className = "button";
        playButton.href = "/game";

        buttonContainer.append(playButton);
        playButton.innerText = "Play";
        return buttonContainer;
    }

    public dispose(): void {

    }
}
