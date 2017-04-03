import { Action } from "redux";

export const SHOW_STATE_MACHINE_PROPERTIES = "SHOW_STATE_MACHINE_PROPERTIES ";
export const HIDE_STATE_MACHINE_PROPERTIES = "HIDE_STATE_MACHINE_PROPERTIES";
export const SET_STATE_MACHINE_ID = "SET_STATE_MACHINE_ID";

export interface GlobalStateMachinePropertiesAction extends ShowStateMachinePropertiesAction, SetStateMachineIdAction {
};

export interface ShowStateMachinePropertiesAction extends Action {
    stateMachine: string;
    id: string;
};

export interface SetStateMachineIdAction extends Action {
    id: string;
};

export const showStateMachineProperties = (stateMachine: string, id: string): ShowStateMachinePropertiesAction => {
    return {
        type: SHOW_STATE_MACHINE_PROPERTIES,
        stateMachine,
        id
    };
};

export const hideStateMachineProperties = (): Action => {
    return {
        type: HIDE_STATE_MACHINE_PROPERTIES
    };
};

export const setStateMachineId = (id): SetStateMachineIdAction => {
    return {
        type: SET_STATE_MACHINE_ID,
        id
    };
};