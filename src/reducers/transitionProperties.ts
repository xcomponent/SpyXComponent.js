import { HIDE_TRANSITION_PROPERTIES, SHOW_TRANSITION_PROPERTIES, SET_JSON_MESSAGE_STRING, SET_CURRENT_ID, SET_PRIVATE_TOPIC, SEND, SEND_CONTEXT, GlobalTransitionPropertiesAction, ShowTransitionPropertiesAction, HideTransitionPropertiesAction, SetJsonMessageStringAction, SetCurrentIdAction, SetPrivateTopicAction, SendAction, SendContextAction } from "../actions";
import { Reducer } from "redux";
import { send, sendContext } from "../core";

export interface TransitionPropertiesState {
    active: boolean;
    stateMachine: string;
    messageType: string;
    jsonMessageString: string;
    id: string;
    defaultPrivateTopic: string;
    privateTopics: string[];
}

const initialState: TransitionPropertiesState = {
    active: false,
    stateMachine: undefined,
    messageType: undefined,
    jsonMessageString: undefined,
    id: undefined,
    defaultPrivateTopic: undefined,
    privateTopics: []
};

export const transitionPropertiesReducer: Reducer<TransitionPropertiesState> = (state: TransitionPropertiesState = initialState, action: GlobalTransitionPropertiesAction): TransitionPropertiesState => {
    switch (action.type) {
        case HIDE_TRANSITION_PROPERTIES:
            return {
                ...state,
                active: false
            };
        case SHOW_TRANSITION_PROPERTIES:
            const showTransitionPropertiesAction = <ShowTransitionPropertiesAction>action;
            return {
                ...state,
                active: true,
                stateMachine: showTransitionPropertiesAction.stateMachine,
                messageType: showTransitionPropertiesAction.messageType,
                jsonMessageString: showTransitionPropertiesAction.jsonMessageString,
                id: showTransitionPropertiesAction.id,
                defaultPrivateTopic: showTransitionPropertiesAction.privateTopic,
                privateTopics: showTransitionPropertiesAction.privateTopics
            };
        case SET_JSON_MESSAGE_STRING:
            const setJsonMessageStringAction = <SetJsonMessageStringAction>action;
            return {
                ...state,
                jsonMessageString: setJsonMessageStringAction.jsonMessageString
            };
        case SET_CURRENT_ID:
            const setCurrentIdAction = <SetCurrentIdAction>action;
            return {
                ...state,
                id: setCurrentIdAction.id
            };
        case SET_PRIVATE_TOPIC:
            const setPrivateTopicAction = <SetPrivateTopicAction>action;
            return {
                ...state,
                defaultPrivateTopic: setPrivateTopicAction.privateTopic
            };
        case SEND:
            const sendAction = <SendAction>action;
            send(sendAction.component, sendAction.stateMachine, sendAction.messageType, sendAction.jsonMessageString, sendAction.privateTopic);
            return state;
        case SEND_CONTEXT:
            const sendContextAction = <SendContextAction>action;
            sendContext(sendContextAction.stateMachineRef, sendContextAction.messageType, sendContextAction.jsonMessageString, sendContextAction.privateTopic);
            return state;
    }
    return state;
};
