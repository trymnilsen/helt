import { JsonNode, ChangeOperation } from "./jsonNode";
import { Json } from "../json";

export enum OperationMode {
    update,
    sync
}
export interface NodeOperation {
    mode?: OperationMode;
    operation: ChangeOperation;
    path: string[];
    data: Json;
}

export function applyOperations(ops: NodeOperation[], node: JsonNode): void {
    ops.forEach((element) => {
        applySingleOperation(element, node);
    });
}

function applySingleOperation(operation: NodeOperation, node: JsonNode): void {
    switch (operation.operation) {
        case ChangeOperation.Added:
            node.put(operation.data, operation.path);
            break;
        case ChangeOperation.Removed:
            node.removeChild(operation.path);
            break;
        default:
            break;
    }
}
