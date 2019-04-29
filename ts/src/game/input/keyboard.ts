import { Event, EventListener } from "../../event/event";
import { InputActionType } from "./input";

export type KeyboardMap = { [key: string]: InputActionType };

export class Keyboard {
    private keyboardMap: KeyboardMap;
    private _keyEvent: Event<InputActionType>;
    private keysDown: { [id: string]: boolean };
    public constructor() {
        this.keyboardMap = getKeyboardMap();
        this.keysDown = {};
        this._keyEvent = new Event();
        window.addEventListener("keydown", this.onKeyPress);
        window.addEventListener("keyup", this.onKeyUp);
    }
    public dispose() {
        this._keyEvent.dispose();
    }

    public get keyEvent(): EventListener<InputActionType> {
        return this._keyEvent;
    }

    private onKeyUp = (event: KeyboardEvent) => {
        this.keysDown[event.key] = false;
    };

    private onKeyPress = (event: KeyboardEvent) => {
        const action = this.keyboardMap[event.key];
        if (!!action && !this.keysDown[event.key]) {
            console.log("[keyboard - onKeyPress] Key pressed: ", event);
            this._keyEvent.publish(action);
        }
        this.keysDown[event.key] = true;
    };
}

export function getKeyboardMap(): KeyboardMap {
    const userMap = window.localStorage.getItem(UserKeyboardMapStorageKey);
    if (!!userMap) {
        try {
            return JSON.parse(userMap) as KeyboardMap;
        } catch (err) {
            console.error(
                "[keyboard - getKeyboardMap] Failed to parse user keyboard map",
                err
            );
            return DefaultKeyboardMap;
        }
    }
    console.log(
        "[keyboard - getKeyboardMap] No keyboardmap defined, returning default",
        DefaultKeyboardMap
    );
    return DefaultKeyboardMap;
}

export const UserKeyboardMapStorageKey = "KEYBOARD_USER_MAP";
export const DefaultKeyboardMap: KeyboardMap = {
    ArrowRight: InputActionType.RIGHT_PRESS,
    ArrowLeft: InputActionType.LEFT_PRESS,
    ArrowUp: InputActionType.UP_PRESS,
    ArrowDown: InputActionType.DOWN_PRESS
};
