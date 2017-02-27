export const INITIALIZATION = "INITIALIZATION";

export const SET_CURRENT_COMPONENT = "SET_CURRENT_COMPONENT";

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
