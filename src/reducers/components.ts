import { INITIALIZATION, SET_CURRENT_COMPONENT } from "actions/components";
/*
componentProperties: {
    componentName: {
        dc: dc,
        instances: {...}
    }
}
*/
const initialState = {
    componentProperties: {},
    currentComponent: undefined,
    projectName: undefined,
    initialized: false
};

const defaultAction = {
    type: undefined,
    componentProperties: undefined,
    currentComponent: undefined,
    projectName: undefined,
    initialized: undefined
};

export const componentsReducer = (state = initialState, action = defaultAction) => {
    switch (action.type) {
        case INITIALIZATION:
            return {
                ...state,
                componentProperties: action.componentProperties,
                currentComponent: action.currentComponent,
                projectName: action.projectName,
                initialized: true
            };
        case SET_CURRENT_COMPONENT:
            return {
                ...state,
                currentComponent: action.currentComponent
            };
    }
    return state;
};