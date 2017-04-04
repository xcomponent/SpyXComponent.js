import { SHOW_STATE_MACHINE_PROPERTIES, HIDE_STATE_MACHINE_PROPERTIES, SET_STATE_MACHINE_ID, GlobalStateMachinePropertiesAction, ShowStateMachinePropertiesAction, SetStateMachineIdAction } from "actions/stateMachineProperties";
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
            let showStateMachinePropertiesAction = <ShowStateMachinePropertiesAction>action;
            return {
                ...state,
                active: true,
                stateMachine: showStateMachinePropertiesAction.stateMachine,
                id: showStateMachinePropertiesAction.id
            };
        case SET_STATE_MACHINE_ID:
            let setStateMachineIdAction = <SetStateMachineIdAction>action;
            return {
                ...state,
                id: setStateMachineIdAction.id
            };
    }
    return state;
};
