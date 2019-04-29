import { View } from "./view";

interface Route {
    regex: RegExp;
    view: View;
}

export class NotFoundView extends View {
    public render(): HTMLElement {
        console.log("[router - NotFoundView] rendering not found");
        const container = document.createElement("div");
        container.innerText = "Not found";
        return container;
    }

    public dispose(): void {
        console.log("[router - NotFoundView] Disposing not found view");
    }
}

export class Router {
    private currentView: View;
    private currentElement: HTMLElement;
    private container: HTMLElement;
    private routes: Route[];
    private notFoundView: NotFoundView;

    public constructor(
        mountingPoint: string,
        routes: { [id: string]: View }
    ) {
        this.container = document.querySelector(mountingPoint);
        document.addEventListener("click", this.documentClick);
        window.addEventListener("popstate", this.stackPopped);
        this.notFoundView = new NotFoundView();
        this.routes = this.createRoutes(routes);
    }

    public init() {
        this.routeView();
    }

    private documentClick = (event: MouseEvent) => {
        const targetElement = event.target as HTMLAnchorElement;
        if (!!targetElement && targetElement.tagName.toLowerCase() === "a") {
            event.preventDefault();
            event.stopImmediatePropagation();

            this.routeView(targetElement.pathname);
        }
    };

    private stackPopped = (event: PopStateEvent) => {
        console.log("[router] Stack popped", event);
        this.routeView();
    };

    private routeView(url?: string) {
        if (!!url) {
            window.history.pushState({}, "", url);
        }
        if (!!this.currentView) {
            this.currentView.dispose();
            this.currentElement.remove();
        }
        const view: View = this.getView();
        this.currentView = view;
        console.log(`[router - routeView] Rendering to ${view}`);
        const element = view.render();
        this.currentElement = element;
        this.container.append(element);
        console.log("[router - routeView] Mounting view");
        view.onMounted();
    }

    private getView(): View {
        const viewName = window.location.pathname;
        console.log("[router - getView] Finding view for ", viewName);
        const route = this.routes.find((x) => x.regex.exec(viewName) !== null);
        if (!!route) {
            return route.view;
        } else {
            console.log(
                `[router - getView] view not found: ${viewName} available routes are `,
                this.routes
            );
            return this.notFoundView;
        }
    }

    private createRoutes(routes: { [id: string]: View }): Route[] {
        const finalRoutes: Route[] = [];
        for (const path in routes) {
            if (routes.hasOwnProperty(path)) {
                const view = routes[path];
                try {
                    const regex = new RegExp(path);
                    finalRoutes.push({ regex, view });
                } catch {
                    console.error(
                        "[router - createRoutes] Could not create route for invalid regex",
                        path
                    );
                }
            }
        }
        if (finalRoutes.length === 0) {
            console.warn("[router - createRoutes] No routes defined");
        }
        return finalRoutes;
    }
}
