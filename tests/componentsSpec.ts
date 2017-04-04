import * as deepFreeze from "deep-freeze";
import { INITIALIZATION, SET_CURRENT_COMPONENT, SET_AUTO_CLEAR } from "actions/components";
import { componentsReducer } from "reducers/components";

describe("Test components reducer", () => {
    it("When an INITIALIZATION action is received, it should initialize the state", () => {
        const stateBefore = {
            componentProperties: {},
            currentComponent: undefined,
            projectName: undefined,
            initialized: undefined,
            autoClear: undefined
        };
        deepFreeze(stateBefore);
        const componentProperties = {
            "componentName": {
                "instances": {},
                "drawComponent": null
            }
        };
        const currentComponent = "currentComponent";
        const projectName = "projectName";
        const initialized = true;
        const action = {
            type: INITIALIZATION,
            componentProperties,
            currentComponent,
            projectName,
            initialized
        };
        deepFreeze(action);
        const stateAfter = {
            componentProperties,
            currentComponent,
            projectName,
            initialized
        };
        expect(
            componentsReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

    it("When an SET_CURRENT_COMPONENT action is received, it should update the currentComponent", () => {
        const oldCurrentComponent = "oldCurrentComponent";
        const componentProperties = {
            "componentName": {
                diagram: undefined,
                stateMachineProperties: {},
                finalStates: [],
                entryPointState: undefined,
            }
        };
        const projectName = "projectName";
        const initialized = true;
        const stateBefore = {
            componentProperties,
            currentComponent: oldCurrentComponent,
            projectName,
            initialized,
            autoClear: undefined
        };
        deepFreeze(stateBefore);
        const currentComponent = "currentComponent";
        const action = {
            type: SET_CURRENT_COMPONENT,
            currentComponent,
            componentProperties: undefined
        };
        deepFreeze(action);
        const stateAfter = {
            componentProperties,
            currentComponent,
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
            currentComponent: undefined,
            projectName: undefined,
            initialized: undefined,
            autoClear: autoClear
        };
        deepFreeze(stateBefore);
        const currentComponent = "currentComponent";
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