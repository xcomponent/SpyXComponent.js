export const SHOW_STATE_MACHINE_PROPERTIES = "SHOW_STATE_MACHINE_PROPERTIES ";
export const HIDE_STATE_MACHINE_PROPERTIES = "HIDE_STATE_MACHINE_PROPERTIES";
export const SET_STATE_MACHINE_ID = "SET_STATE_MACHINE_ID";

export const showStateMachineProperties = (stateMachine, id) => {
    return {
        type: SHOW_STATE_MACHINE_PROPERTIES,
        stateMachine,
        id
    };
};

export const hideStateMachineProperties = () => {
    return {
        type: HIDE_STATE_MACHINE_PROPERTIES
    };
};

export const setStateMachineId = (id) => {
    return {
        type: SET_STATE_MACHINE_ID,
        id
    };
};