import * as deepFreeze from "deep-freeze";
import { INIT_SESSION } from "../actions";
import { sessionReducer } from "./session";

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
        (window as any).WebSocket = Object;
        expect(
            sessionReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });
});