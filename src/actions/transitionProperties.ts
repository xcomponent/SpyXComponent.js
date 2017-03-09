export const SHOW_TRANSITION_PROPERTIES = "SHOW_TRANSITION_PROPERTIES";
export const HIDE_TRANSITION_PROPERTIES = "HIDE_TRANSITION_PROPERTIES";
export const SET_JSON_MESSAGE_STRING = "SET_JSON_MESSAGE_STRING";
export const SET_CURRENT_ID = "SET_CURRENT_ID";

export const showTransitionProperties = (stateMachine, messageType, jsonMessageString, id) => {
    return {
        type: SHOW_TRANSITION_PROPERTIES,
        stateMachine,
        messageType,
        jsonMessageString,
        id
    };
};

export const hideTransitionProperties = () => {
    return {
        type: HIDE_TRANSITION_PROPERTIES
    };
};

export const setJsonMessageString = (jsonMessageString) => {
    return {
        type: SET_JSON_MESSAGE_STRING,
        jsonMessageString
    };
};

export const setCurrentId = (id) => {
    return {
        type: SET_CURRENT_ID,
        id
    };
};