import * as deepFreeze from "deep-freeze";
import { INIT_COMPOSITION_MODEL } from "actions/compositionModel";
import { compositionModelReducer } from "reducers/compositionModel";

describe("Test components reducer", () => {
    it("When an INIT_COMPOSITION_MODEL action is received, it should initialize the component model value", () => {
        let stateBefore = {
            initialized: false,
            value: undefined
        };
        deepFreeze(stateBefore);
        let value = "randomValue";
        let action = {
            type: INIT_COMPOSITION_MODEL,
            compositionModel: value
        };
        let stateAfter = {
            initialized: true,
            value
        };
        expect(
            compositionModelReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });
});