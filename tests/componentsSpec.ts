import * as deepFreeze from "deep-freeze";
import { INITIALIZATION, SET_CURRENT_COMPONENT } from "actions/components";
import { componentsReducer } from "reducers/components";

describe("Test components reducer", () => {
    it("When an INITIALIZATION action is received, it should initialize the state", () => {
        let stateBefore = {
            componentProperties: {},
            currentComponent: undefined,
            projectName: undefined,
            initialized: undefined
        };
        deepFreeze(stateBefore);
        let componentProperties = {
            "componentName": {
                "instances": {},
                "drawComponent": null
            }
        };
        let currentComponent = "currentComponent";
        let projectName = "projectName";
        let initialized = true;
        let action = {
            type: INITIALIZATION,
            componentProperties,
            currentComponent,
            projectName,
            initialized
        };
        let stateAfter = {
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
        let oldCurrentComponent = "oldCurrentComponent";
        let componentProperties = {
            "componentName": {
                "instances": {},
                "diagram": null
            }
        };
        let projectName = "projectName";
        let initialized = true;
        let stateBefore = {
            componentProperties,
            currentComponent: oldCurrentComponent,
            projectName,
            initialized
        };
        deepFreeze(stateBefore);
        let currentComponent = "currentComponent";
        let action = {
            type: SET_CURRENT_COMPONENT,
            currentComponent,
            componentProperties: undefined
        };
        let stateAfter = {
            componentProperties,
            currentComponent,
            projectName,
            initialized
        };
        expect(
            componentsReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

});