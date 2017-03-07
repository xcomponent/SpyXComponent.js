export const INITIALIZATION = "INITIALIZATION";
export const SET_CURRENT_COMPONENT = "SET_CURRENT_COMPONENT";
export const UPDATE_GRAPHIC = "UPDATE_GRAPHIC";

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

export const updateGraphic = (component, stateMachine, data) => {
    return {
        type: UPDATE_GRAPHIC,
        component,
        stateMachine,
        data
    };
};