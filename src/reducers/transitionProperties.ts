import { HIDE_TRANSITION_PROPERTIES, SHOW_TRANSITION_PROPERTIES } from "actions/transitionProperties";

let initialState = {
    active: false,
    stateMachine: undefined,
    messageType: undefined
};

export const transitionPropertiesReducer = (state = {}, action) => {
    switch (action.type) {
        case HIDE_TRANSITION_PROPERTIES:
            return {
                active: false
            };
        case SHOW_TRANSITION_PROPERTIES:
            return {
                active: true,
                stateMachine: action.stateMachine,
                messageType: action.messageType
            };
    }
    return state;
};
