import { Action } from "redux";

export const SHOW_TRANSITION_PROPERTIES = "SHOW_TRANSITION_PROPERTIES";
export const HIDE_TRANSITION_PROPERTIES = "HIDE_TRANSITION_PROPERTIES";
export const SET_JSON_MESSAGE_STRING = "SET_JSON_MESSAGE_STRING";
export const SET_CURRENT_ID = "SET_CURRENT_ID";
export const SET_PRIVATE_TOPIC = "SET_PRIVATE_TOPIC";

export interface GlobalTransitionPropertiesAction extends ShowTransitionPropertiesAction, HideTransitionPropertiesAction, SetJsonMessageStringAction, SetCurrentIdAction, SetPrivateTopicAction {
};

export interface ShowTransitionPropertiesAction extends Action {
    stateMachine: string;
    messageType: string;
    jsonMessageString: string;
    id: string;
    privateTopic: string;
};

export interface HideTransitionPropertiesAction extends Action {
};

export interface SetJsonMessageStringAction extends Action {
    jsonMessageString: string;
};

export interface SetCurrentIdAction extends Action {
    id: string;
};

export interface SetPrivateTopicAction extends Action {
    privateTopic: string;
};

export const showTransitionProperties = (stateMachine: string, messageType: string, jsonMessageString: string, id: string, privateTopic: string): ShowTransitionPropertiesAction => {
    return {
        type: SHOW_TRANSITION_PROPERTIES,
        stateMachine,
        messageType,
        jsonMessageString,
        id,
        privateTopic
    };
};

export const hideTransitionProperties = (): HideTransitionPropertiesAction => {
    return {
        type: HIDE_TRANSITION_PROPERTIES
    };
};

export const setJsonMessageString = (jsonMessageString: string): SetJsonMessageStringAction => {
    return {
        type: SET_JSON_MESSAGE_STRING,
        jsonMessageString
    };
};

export const setCurrentId = (id: string): SetCurrentIdAction => {
    return {
        type: SET_CURRENT_ID,
        id
    };
};

export const setPrivateTopic = (privateTopic: string): SetPrivateTopicAction => {
    return {
        type: SET_PRIVATE_TOPIC,
        privateTopic
    };
};