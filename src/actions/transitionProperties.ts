import { Action } from "redux";
import { Dispatch } from "redux";
import { XCSpyState } from "reducers/SpyReducer";
import sessionXCSpy from "utils/sessionXCSpy";
import { ThunkAction } from "redux-thunk";

export const SHOW_TRANSITION_PROPERTIES = "SHOW_TRANSITION_PROPERTIES";
export const HIDE_TRANSITION_PROPERTIES = "HIDE_TRANSITION_PROPERTIES";
export const SET_JSON_MESSAGE_STRING = "SET_JSON_MESSAGE_STRING";
export const SET_CURRENT_ID = "SET_CURRENT_ID";
export const SET_PRIVATE_TOPIC = "SET_PRIVATE_TOPIC";
export const SEND = "SEND";
export const SEND_CONTEXT = "SEND_CONTEXT";

export type GlobalTransitionPropertiesAction = ShowTransitionPropertiesAction | HideTransitionPropertiesAction | SetJsonMessageStringAction | SetCurrentIdAction | SetPrivateTopicAction | SendAction | SendContextAction;

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

export interface SendAction extends Action {
    component: string;
    stateMachine: string;
    messageType: string;
    jsonMessageString: string;
};

export interface SendContextAction extends Action {
    stateMachineRef: any;
    messageType: string;
    jsonMessageString: string;
};

export const showTransitionProperties = (stateMachine: string, messageType: string, jsonMessageString: string): ThunkAction<void, XCSpyState, void> => {
    return (dispatch: Dispatch<XCSpyState>, getState: () => XCSpyState) => {
        sessionXCSpy.getPromiseCreateSession()
            .then((session) => {
                if (session.createPublisher().canPublish(getState().components.currentComponent, stateMachine, messageType)) {
                    const componentProperties = getState().components.componentProperties;
                    const currentComponent = getState().components.currentComponent;
                    const firstId = Object.keys(componentProperties[currentComponent].stateMachineProperties[stateMachine])[0];
                    dispatch({
                        type: SHOW_TRANSITION_PROPERTIES,
                        stateMachine,
                        messageType,
                        jsonMessageString,
                        id: firstId,
                        privateTopic: sessionXCSpy.getDefaultPrivateTopic()
                    });
                } else {
                    alert(`API cannot send ${messageType} event to ${stateMachine}`);
                }
            });
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

export const send = (component: string, stateMachine: string, messageType: string, jsonMessageString: string): SendAction => {
    return {
        type: SEND,
        component,
        stateMachine,
        messageType,
        jsonMessageString
    };
};

export const sendContext = (stateMachineRef: any, messageType: string, jsonMessageString: string): SendContextAction => {
    return {
        type: SEND_CONTEXT,
        stateMachineRef,
        messageType,
        jsonMessageString
    };
};