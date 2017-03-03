export const INITIALIZATION = "INITIALIZATION";
export const SET_CURRENT_COMPONENT = "SET_CURRENT_COMPONENT";
export const UPDATE_STATE_MACHINE = "UPDATE_STATE_MACHINE";

export const initialization = (componentProperties, currentComponent, projectName) => {
    return {
        type: INITIALIZATION,
        componentProperties,
        currentComponent,
        projectName
    };
};

export const setCurrentComponent = (currentComponent) => {
    return {
        type: SET_CURRENT_COMPONENT,
        currentComponent
    };
};

export const updateStateMachine = (component, stateMachine) => {
    return {
        type: UPDATE_STATE_MACHINE,
        component,
        stateMachine
    };
};
