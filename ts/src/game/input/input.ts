import { Keyboard } from "./keyboard";
import { Event, EventListener } from "../../event/event";

export enum InputActionType {
    LEFT_PRESS = "LEFT_PRESS",
    RIGHT_PRESS = "RIGHT_PRESS",
    UP_PRESS = "UP_PRESS",
    DOWN_PRESS = "DOWN_PRESS"
}
export interface InputEvent {
    action: InputActionType;
    inputType: InputType;
}
export enum InputType {
    Keyboard
}
export class Input {
    private _currentInputType: InputType;
    private events: Event<InputEvent>;
    private keyboard: Keyboard;
    public constructor() {
        this.events = new Event();
        this.keyboard = new Keyboard();
        this.keyboard.keyEvent.listen((action) => {
            this.events.publish({
                inputType: InputType.Keyboard,
                action: action
            });
        });
    }
    public dispose() {
        this.keyboard.dispose();
    }
    public get onInput(): EventListener<InputEvent> {
        return this.events;
    }
    public get currentInputType(): InputType {
        return this._currentInputType;
    }
}
