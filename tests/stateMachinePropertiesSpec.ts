import * as deepFreeze from "deep-freeze";
import { SHOW_STATE_MACHINE_PROPERTIES, SET_STATE_MACHINE_ID, HIDE_STATE_MACHINE_PROPERTIES } from "actions";
import { stateMachinePropertiesReducer } from "reducers/stateMachineProperties";

describe("Test stateMachineProperties reducer", () => {
    it("When a SHOW_STATE_MACHINE_PROPERTIES action is received, it should set the stateMachine and its id", () => {
        const stateBefore = {
            active: false,
            stateMachine: undefined,
            id: undefined
        };
        deepFreeze(stateBefore);
        const stateMachine = "stateMachine";
        const id = "id";
        const action = {
            type: SHOW_STATE_MACHINE_PROPERTIES,
            stateMachine,
            id
        };
        deepFreeze(action);
        const stateAfter = {
            active: true,
            stateMachine,
            id
        };
        expect(
            stateMachinePropertiesReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

    it("When a SET_STATE_MACHINE_ID action is received, it should set the id of the same stateMachine", () => {
        const stateMachine = "stateMachine";
        const oldId = "oldId";
        const newId = "newId";
        const stateBefore = {
            active: true,
            stateMachine,
            id: oldId
        };
        deepFreeze(stateBefore);
        const action = {
            type: SET_STATE_MACHINE_ID,
            id: newId
        };
        deepFreeze(action);
        const stateAfter = {
            active: true,
            stateMachine,
            id: newId
        };
        expect(
            stateMachinePropertiesReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

    it("When a HIDE_STATE_MACHINE_PROPERTIES action is received, it should set the active property to false", () => {
        const stateMachine = "stateMachine";
        const id = "id";
        const stateBefore = {
            active: true,
            stateMachine,
            id
        };
        deepFreeze(stateBefore);
        const action = {
            type: HIDE_STATE_MACHINE_PROPERTIES
        };
        deepFreeze(action);
        const stateAfter = {
            active: false,
            stateMachine,
            id
        };
        expect(
            stateMachinePropertiesReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

});