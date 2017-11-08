import * as deepFreeze from "deep-freeze";
import { INIT_COMPOSITION_MODEL } from "../actions";
import { compositionModelReducer } from "./compositionModel";

describe("Test components reducer", () => {
    it("When an INIT_COMPOSITION_MODEL action is received, it should initialize the component model value", () => {
        const stateBefore = {
            initialized: false,
            value: undefined
        };
        deepFreeze(stateBefore);
        const value = "randomValue";
        const action = {
            type: INIT_COMPOSITION_MODEL,
            compositionModel: value,
            initialized: undefined
        };
        deepFreeze(action);
        const stateAfter = {
            initialized: true,
            value
        };
        expect(
            compositionModelReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });
});