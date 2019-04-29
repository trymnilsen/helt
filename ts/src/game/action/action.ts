import { JsonTree } from "../../storage/jsonNode";
import { NodeOperation } from "../../storage/nodeOperation";

export interface Action<T = any> {
    name: string;
    data: T;
}
export function action<T extends {}>(name: string, data: T): Action<T> {
    return {
        name,
        data
    };
}

export type ActionReducer<T = any> = (
    action: Action<T>,
    state: JsonTree
) => NodeOperation[];
