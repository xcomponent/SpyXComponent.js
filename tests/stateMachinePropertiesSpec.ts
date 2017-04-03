import * as deepFreeze from "deep-freeze";
import { SHOW_STATE_MACHINE_PROPERTIES, SET_STATE_MACHINE_ID, HIDE_STATE_MACHINE_PROPERTIES } from "actions/stateMachineProperties";
import { stateMachinePropertiesReducer } from "reducers/stateMachineProperties";

describe("Test stateMachineProperties reducer", () => {
    it("When a SHOW_STATE_MACHINE_PROPERTIES action is received, it should set the stateMachine and its id", () => {
        let stateBefore = {
            active: false,
            stateMachine: undefined,
            id: undefined
        };
        deepFreeze(stateBefore);
        let stateMachine = "stateMachine";
        let id = "id";
        let action = {
            type: SHOW_STATE_MACHINE_PROPERTIES,
            stateMachine,
            id
        };
        let stateAfter = {
            active: true,
            stateMachine,
            id
        };
        expect(
            stateMachinePropertiesReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

    it("When a SET_STATE_MACHINE_ID action is received, it should set the id of the same stateMachine", () => {
        let stateMachine = "stateMachine";
        let oldId = "oldId";
        let newId = "newId";
        let stateBefore = {
            active: true,
            stateMachine,
            id: oldId
        };
        deepFreeze(stateBefore);
        let action = {
            type: SET_STATE_MACHINE_ID,
            id: newId
        };
        let stateAfter = {
            active: true,
            stateMachine,
            id: newId
        };
        expect(
            stateMachinePropertiesReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

    it("When a HIDE_STATE_MACHINE_PROPERTIES action is received, it should set the active property to false", () => {
        let stateMachine = "stateMachine";
        let id = "id";
        let stateBefore = {
            active: true,
            stateMachine,
            id
        };
        deepFreeze(stateBefore);
        let action = {
            type: HIDE_STATE_MACHINE_PROPERTIES
        };
        let stateAfter = {
            active: false,
            stateMachine,
            id
        };
        expect(
            stateMachinePropertiesReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

});