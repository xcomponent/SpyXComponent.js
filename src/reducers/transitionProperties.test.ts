import * as deepFreeze from "deep-freeze";
import { HIDE_TRANSITION_PROPERTIES, SHOW_TRANSITION_PROPERTIES, SET_JSON_MESSAGE_STRING, SET_CURRENT_ID } from "../actions/transitionProperties";
import { transitionPropertiesReducer } from "./transitionProperties";
import { SET_PRIVATE_TOPIC } from "../actions";

describe("Test transitionProperties reducer", () => {
    it("When a HIDE_TRANSITION_PROPERTIES action is received, it should set the active properties to false", () => {
        const stateBefore = {
            active: true,
            stateMachine: undefined,
            messageType: undefined,
            jsonMessageString: undefined,
            id: undefined,
            defaultPrivateTopic: undefined,
            privateTopics: []
        };
        deepFreeze(stateBefore);
        const action = {
            type: HIDE_TRANSITION_PROPERTIES
        };
        deepFreeze(action);
        const stateAfter = {
            active: false,
            stateMachine: undefined,
            messageType: undefined,
            jsonMessageString: undefined,
            id: undefined,
            defaultPrivateTopic: undefined,
            privateTopics: []
        };
        expect(
            transitionPropertiesReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

    it("When a SHOW_TRANSITION_PROPERTIES action is received, it should initialize the transition properties", () => {
        const stateMachine = "stateMachine";
        const messageType = "messageType";
        const jsonMessageString = "jsonMessageString";
        const id = "id";
        const stateBefore = {
            active: false,
            stateMachine: undefined,
            messageType: undefined,
            jsonMessageString: undefined,
            id: undefined,
            defaultPrivateTopic: undefined,
            privateTopics: []
        };
        deepFreeze(stateBefore);
        const action = {
            type: SHOW_TRANSITION_PROPERTIES,
            stateMachine,
            messageType,
            jsonMessageString,
            id,
            defaultPrivateTopic: undefined,
            privateTopics: []
        };
        deepFreeze(action);
        const stateAfter = {
            active: true,
            stateMachine,
            messageType,
            jsonMessageString,
            id,
            defaultPrivateTopic: undefined,
            privateTopics: []
        };
        expect(
            transitionPropertiesReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

    it("When a SET_JSON_MESSAGE_STRING action is received, it should set the jsonMessage properties", () => {
        const active = true;
        const stateMachine = "stateMachine";
        const messageType = "messageType";
        const jsonMessageString = "jsonMessageString";
        const newJsonMessageString = "newJsonMessageString";
        const id = "id";
        const stateBefore = {
            active,
            stateMachine,
            messageType,
            jsonMessageString,
            id,
            defaultPrivateTopic: undefined,
            privateTopics: []
        };
        deepFreeze(stateBefore);
        const action = {
            type: SET_JSON_MESSAGE_STRING,
            stateMachine,
            messageType,
            jsonMessageString: newJsonMessageString,
            id
        };
        deepFreeze(action);
        const stateAfter = {
            active,
            stateMachine,
            messageType,
            jsonMessageString: newJsonMessageString,
            id,
            defaultPrivateTopic: undefined,
            privateTopics: []
        };
        expect(
            transitionPropertiesReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

    it("When a SET_CURRENT_ID action is received, it should set the current id properties", () => {
        const active = true;
        const stateMachine = "stateMachine";
        const messageType = "messageType";
        const jsonMessageString = "jsonMessageString";
        const id = "id";
        const newId = "newId";
        const stateBefore = {
            active,
            stateMachine,
            messageType,
            jsonMessageString,
            id,
            defaultPrivateTopic: undefined,
            privateTopics: []
        };
        deepFreeze(stateBefore);
        const action = {
            type: SET_CURRENT_ID,
            stateMachine,
            messageType,
            jsonMessageString,
            id: newId
        };
        deepFreeze(action);
        const stateAfter = {
            active,
            stateMachine,
            messageType,
            jsonMessageString,
            id: newId,
            defaultPrivateTopic: undefined,
            privateTopics: []
        };
        expect(
            transitionPropertiesReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

        it("When a SET_PRIVATE_TOPIC action is received, it should set the default private topic", () => {
        const randomPrivateTopic = "edb1c096-d318-4abc-85e0-7865294fb4dd";
        const stateBefore = {
            active: undefined,
            stateMachine: undefined,
            messageType: undefined,
            jsonMessageString: undefined,
            id: undefined,
            defaultPrivateTopic: undefined,
            privateTopics: undefined
        };
        deepFreeze(stateBefore);
        const action = {
            type: SET_PRIVATE_TOPIC,
            privateTopic: randomPrivateTopic
        };
        deepFreeze(action);
        const stateAfter = {
            active: undefined,
            stateMachine: undefined,
            messageType: undefined,
            jsonMessageString: undefined,
            id: undefined,
            defaultPrivateTopic: randomPrivateTopic,
            privateTopics: undefined
        };
        expect(
            transitionPropertiesReducer(stateBefore, action)
        ).toEqual(stateAfter);
    });

});