import { HIDE_TRANSITION_PROPERTIES, SHOW_TRANSITION_PROPERTIES, SET_JSON_MESSAGE_STRING, SET_CURRENT_ID, SET_PRIVATE_TOPIC, SEND, SEND_CONTEXT, GlobalTransitionPropertiesAction, ShowTransitionPropertiesAction, HideTransitionPropertiesAction, SetJsonMessageStringAction, SetCurrentIdAction, SetPrivateTopicAction, SendAction, SendContextAction } from "actions";
import sessionXCSpy from "utils/sessionXCSpy";
import { Reducer } from "redux";
import { send, sendContext } from "core";

export interface TransitionPropertiesState {
    active: boolean;
    stateMachine: string;
    messageType: string;
    jsonMessageString: string;
    id: string;
    privateTopic: string;
};

const initialState: TransitionPropertiesState = {
    active: false,
    stateMachine: undefined,
    messageType: undefined,
    jsonMessageString: undefined,
    id: undefined,
    privateTopic: undefined
};

export const transitionPropertiesReducer: Reducer<TransitionPropertiesState> = (state: TransitionPropertiesState = initialState, action: GlobalTransitionPropertiesAction): TransitionPropertiesState => {
    switch (action.type) {
        case HIDE_TRANSITION_PROPERTIES:
            return initialState;
        case SHOW_TRANSITION_PROPERTIES:
            const showTransitionPropertiesAction = <ShowTransitionPropertiesAction>action;
            return {
                ...state,
                active: true,
                stateMachine: showTransitionPropertiesAction.stateMachine,
                messageType: showTransitionPropertiesAction.messageType,
                jsonMessageString: showTransitionPropertiesAction.jsonMessageString,
                id: showTransitionPropertiesAction.id,
                privateTopic: showTransitionPropertiesAction.privateTopic
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
                privateTopic: setPrivateTopicAction.privateTopic
            };
        case SEND:
            const sendAction = <SendAction>action;
            send(sendAction.component, sendAction.stateMachine, sendAction.messageType, sendAction.jsonMessageString);
            return state;
        case SEND_CONTEXT:
            const sendContextAction = <SendContextAction>action;
            sendContext(sendContextAction.stateMachineRef, sendContextAction.messageType, sendContextAction.jsonMessageString);
            return state;
    }
    return state;
};
