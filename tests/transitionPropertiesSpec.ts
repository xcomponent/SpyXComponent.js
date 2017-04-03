import * as deepFreeze from "deep-freeze";
import { HIDE_TRANSITION_PROPERTIES, SHOW_TRANSITION_PROPERTIES, SET_JSON_MESSAGE_STRING, SET_CURRENT_ID } from "actions/transitionProperties";
import { transitionPropertiesReducer } from "reducers/transitionProperties";

describe("Test transitionProperties reducer", () => {
    it("When a HIDE_TRANSITION_PROPERTIES action is received, it should set the active properties to false", () => {
        let stateBefore = {
            active: true,
            stateMachine: undefined,
            messageType: undefined,
            jsonMessageString: undefined,
            id: undefined,
            privateTopic: undefined
        };
        deepFreeze(stateBefore);
        let action = {
            type: HIDE_TRANSITION_PROPERTIES
        };
        let stateAfter = {
            active: false,
            stateMachine: undefined,
            messageType: undefined,
            jsonMessageString: undefined,
            id: undefined,
            privateTopic: undefined
        };
        expect(
            transitionPropertiesReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

    it("When a SHOW_TRANSITION_PROPERTIES action is received, it should initialize the transition properties", () => {
        let stateMachine = "stateMachine";
        let messageType = "messageType";
        let jsonMessageString = "jsonMessageString";
        let id = "id";
        let stateBefore = {
            active: false,
            stateMachine: undefined,
            messageType: undefined,
            jsonMessageString: undefined,
            id: undefined,
            privateTopic: undefined
        };
        deepFreeze(stateBefore);
        let action = {
            type: SHOW_TRANSITION_PROPERTIES,
            stateMachine,
            messageType,
            jsonMessageString,
            id
        };
        let stateAfter = {
            active: true,
            stateMachine,
            messageType,
            jsonMessageString,
            id,
            privateTopic: undefined            
        };
        expect(
            transitionPropertiesReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

    it("When a SET_JSON_MESSAGE_STRING action is received, it should set the jsonMessage properties", () => {
        let active = true;
        let stateMachine = "stateMachine";
        let messageType = "messageType";
        let jsonMessageString = "jsonMessageString";
        let newJsonMessageString = "newJsonMessageString";
        let id = "id";
        let stateBefore = {
            active,
            stateMachine,
            messageType,
            jsonMessageString,
            id,
            privateTopic: undefined
        };
        deepFreeze(stateBefore);
        let action = {
            type: SET_JSON_MESSAGE_STRING,
            stateMachine,
            messageType,
            jsonMessageString: newJsonMessageString,
            id
        };
        let stateAfter = {
            active,
            stateMachine,
            messageType,
            jsonMessageString: newJsonMessageString,
            id
        };
        expect(
            transitionPropertiesReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

    it("When a SET_CURRENT_ID action is received, it should set the current id properties", () => {
        let active = true;
        let stateMachine = "stateMachine";
        let messageType = "messageType";
        let jsonMessageString = "jsonMessageString";
        let id = "id";
        let newId = "newId";
        let stateBefore = {
            active,
            stateMachine,
            messageType,
            jsonMessageString,
            id,
            privateTopic: undefined
        };
        deepFreeze(stateBefore);
        let action = {
            type: SET_CURRENT_ID,
            stateMachine,
            messageType,
            jsonMessageString,
            id: newId
        };
        let stateAfter = {
            active,
            stateMachine,
            messageType,
            jsonMessageString,
            id: newId,
            privateTopic: undefined
        };
        expect(
            transitionPropertiesReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

});