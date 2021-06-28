import { StateNode, State } from "./state";
export declare function createMutable<T extends StateNode>(state: T | State<T>, options?: {
    name?: string;
}): State<T>;
