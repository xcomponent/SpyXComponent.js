import { Action } from "redux";
import { Dispatch } from "redux";
import { XCSpyState } from "reducers/spyReducer";
import sessionXCSpy, { SessionXCSpy } from "../utils/sessionXCSpy";
import { ThunkAction } from "redux-thunk";
import { StateMachineRef, Session } from "reactivexcomponent.js";

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
    privateTopics: string[];
}

export interface HideTransitionPropertiesAction extends Action {
}

export interface SetJsonMessageStringAction extends Action {
    jsonMessageString: string;
}

export interface SetCurrentIdAction extends Action {
    id: string;
}

export interface SetPrivateTopicAction extends Action {
    privateTopic: string;
}

export interface SendAction extends Action {
    component: string;
    stateMachine: string;
    messageType: string;
    jsonMessageString: string;
    privateTopic: string;
}

export interface SendContextAction extends Action {
    stateMachineRef: StateMachineRef;
    messageType: string;
    jsonMessageString: string;
    privateTopic: string;
}

export const showTransitionProperties = (component: string, stateMachine: string, messageType: string, jsonMessageString: string): ThunkAction<void, XCSpyState, void> => {
    return (dispatch: Dispatch<XCSpyState>, getState: () => XCSpyState) => {
        sessionXCSpy.PromiseCreateSession
            .then((session: Session) => {
                if (session.canSend(component, stateMachine, messageType)) {
                    const componentProperties = getState().components.componentProperties;
                    const firstId = Object.keys(componentProperties[component].stateMachineProperties[stateMachine])[0];
                    const privateTopic = getState().transitionProperties.defaultPrivateTopic;
                    dispatch({
                        type: SHOW_TRANSITION_PROPERTIES,
                        stateMachine,
                        messageType,
                        jsonMessageString,
                        id: firstId,
                        privateTopic: (privateTopic) ? privateTopic : session.privateTopics.getDefaultPublisherTopic(),
                        privateTopics: session.privateTopics.getSubscriberTopics()
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

export const send = (component: string, stateMachine: string, messageType: string, jsonMessageString: string, privateTopic: string): SendAction => {
    return {
        type: SEND,
        component,
        stateMachine,
        messageType,
        jsonMessageString,
        privateTopic
    };
};

export const sendContext = (stateMachineRef: StateMachineRef, messageType: string, jsonMessageString: string, privateTopic: string): SendContextAction => {
    return {
        type: SEND_CONTEXT,
        stateMachineRef,
        messageType,
        jsonMessageString,
        privateTopic
    };
};