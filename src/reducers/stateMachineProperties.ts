import { SHOW_STATE_MACHINE_PROPERTIES, HIDE_STATE_MACHINE_PROPERTIES, SET_STATE_MACHINE_ID, GlobalStateMachinePropertiesAction } from "actions/stateMachineProperties";
import { Reducer } from "redux";

export interface StateMachinePropertiesState {
    active: boolean;
    stateMachine: string;
    id: string;
};

const initialState = {
    active: false,
    stateMachine: undefined,
    id: undefined
};

export const stateMachinePropertiesReducer: Reducer<StateMachinePropertiesState> = (state: StateMachinePropertiesState = initialState, action: GlobalStateMachinePropertiesAction): StateMachinePropertiesState => {
    switch (action.type) {
        case HIDE_STATE_MACHINE_PROPERTIES:
            return {
                ...state,
                active: false
            };
        case SHOW_STATE_MACHINE_PROPERTIES:
            return {
                ...state,
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
