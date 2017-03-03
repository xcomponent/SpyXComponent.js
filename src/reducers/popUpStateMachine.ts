import { SHOW_POP_UP, HIDE_POP_UP } from "actions/popUpStateMachine";

const initialState = {
    active: false,
    stateMachine: undefined
};

const defaultAction = {
    type: undefined,
    stateMachine: undefined
};

export const popUpStateMachineReducer = (state = initialState, action = defaultAction) => {
    switch (action.type) {
        case HIDE_POP_UP:
            return {
                active: false
            };
        case SHOW_POP_UP:
            return {
                active: true,
                stateMachine: action.stateMachine
            };
    }
    return state;
};