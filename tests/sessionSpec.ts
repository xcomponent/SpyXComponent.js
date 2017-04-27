import * as deepFreeze from "deep-freeze";
import { INIT_SESSION } from "actions";
import { sessionReducer } from "reducers/session";

describe("Test session reducer", () => {
    it("When an INIT_SESSION action is received, it should init the session", () => {
        const stateBefore = {
            initialized: false
        };
        deepFreeze(stateBefore);
        const action = {
            type: INIT_SESSION,
            api: "",
            serverUrl: "",
            init: (api: string, serverUrl: string) => { }
        };
        deepFreeze(action);
        const stateAfter = {
            initialized: true
        };
        expect(
            sessionReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });
});