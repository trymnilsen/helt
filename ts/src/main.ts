import { MenuView } from "./view/pages/menuView";
import { Router } from "./view/router";
import { GameView } from "./view/pages/gameView";

export function bootstrap() {
    console.log("[main] Bootstrapping");
    const router = new Router(
        "#container",
        {
            "^\\/?$": new MenuView(),
            "\\/game\\/?$": new GameView()
        }
    );
    router.init();
}

document.addEventListener(
    "DOMContentLoaded",
    () => {
        bootstrap();
    },
    false
);
