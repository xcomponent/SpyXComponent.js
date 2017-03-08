export const SHOW_TRANSITION_PROPERTIES = "SHOW_TRANSITION_PROPERTIES";
export const HIDE_TRANSITION_PROPERTIES = "HIDE_TRANSITION_PROPERTIES";

export const showTransitionProperties = (stateMachine, messageType) => {
    return {
        type: SHOW_TRANSITION_PROPERTIES,
        stateMachine,
        messageType
    };
};

export const hideTransitionProperties = () => {
    return {
        type: HIDE_TRANSITION_PROPERTIES
    };
};