import { SHOW_STATE_MACHINE_PROPERTIES, HIDE_STATE_MACHINE_PROPERTIES, SET_STATE_MACHINE_ID } from "actions/stateMachineProperties";

const initialState = {
    active: false,
    stateMachine: undefined,
    id: undefined
};

export const stateMachinePropertiesReducer = (state = initialState, action) => {
    switch (action.type) {
        case HIDE_STATE_MACHINE_PROPERTIES:
            return {
                active: false
            };
        case SHOW_STATE_MACHINE_PROPERTIES:
            return {
                active: true,
                stateMachine: action.stateMachine,
                id: action.id
            };
        case SET_STATE_MACHINE_ID:
            return {
                ...state,
                id: action.id
            };
    }
    return state;
};