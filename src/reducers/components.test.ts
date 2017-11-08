import * as deepFreeze from "deep-freeze";
import { INITIALIZATION, SET_AUTO_CLEAR } from "../actions";
import { componentsReducer } from "./components";

describe("Test components reducer", () => {
    it("When an INITIALIZATION action is received, it should initialize the state", () => {
        const stateBefore = {
            componentProperties: {},
            projectName: undefined,
            initialized: undefined,
            autoClear: undefined
        };
        deepFreeze(stateBefore);
        const componentProperties = {
        };
        const projectName = "projectName";
        const initialized = true;
        const action = {
            type: INITIALIZATION,
            componentProperties,
            projectName,
            initialized
        };
        deepFreeze(action);
        const stateAfter = {
            componentProperties,
            projectName,
            initialized
        };
        expect(
            componentsReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

    it("When an SET_AUTO_CLEAR action is received, it should set autoClear property", () => {
        const autoClear = false;
        const stateBefore = {
            componentProperties: undefined,
            projectName: undefined,
            initialized: undefined,
            autoClear: autoClear
        };
        deepFreeze(stateBefore);
        const action = {
            type: SET_AUTO_CLEAR,
            autoClear: !autoClear
        };
        deepFreeze(action);
        const stateAfter = {
            autoClear: !autoClear
        };
        expect(
            componentsReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

});