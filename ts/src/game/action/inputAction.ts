import { Action } from "./action";
import { InputActionType } from "../input/input";

export type InputAction = Action<InputActionType>;
export const InputActionName = "inputAction";
// export const inputActionReducer: ActionReducer<InputActionData> = (
//     action,
//     state
// ) => {
//     if (movementInput.includes(action.data.inputType)) {
//         return movementReducer(action, state);
//     } else {
//         console.log("[inputactionreducer] ");
//         return [];
//     }
// };

// const movementReducer: ActionReducer<InputActionData> = (action, state) => {
//     const movement: Point = { x: 0, y: 0 };
//     switch (action.data.inputType) {
//         case InputActionType.DOWN_PRESS:
//             movement.y = 1;
//             break;
//         case InputActionType.UP_PRESS:
//             movement.y = -1;
//             break;
//         case InputActionType.LEFT_PRESS:
//             movement.x = -1;
//             break;
//         case InputActionType.RIGHT_PRESS:
//             movement.x = 1;
//             break;
//         default:
//             break;
//     }
//     const path = ["player", action.data.player, "position"];
//     const currentPosition = state.getValue<Point>(path);
//     const newPosition = addPoint(currentPosition, movement);
//     return [
//         {
//             data: newPosition,
//             operation: ChangeOperation.Added,
//             path
//         }
//     ];
// };
