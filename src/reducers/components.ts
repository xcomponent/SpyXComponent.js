import { INITIALIZATION, SET_CURRENT_COMPONENT, UPDATE_STATE_MACHINE } from "actions/components";
import * as go from "gojs";
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

export const componentsReducer = (state = initialState, action) => {
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
        case UPDATE_STATE_MACHINE:
            let diagram: go.Diagram = state.componentProperties[action.component].drawComponent.diagram;
            diagram.model.startTransaction(UPDATE_STATE_MACHINE);
            let data = diagram.findNodeForKey(action.stateMachine).data;
            diagram.model.setDataProperty(data, "numberOfInstances", data.numberOfInstances + 1);
            diagram.model.setDataProperty(data, "text", data.key + " (" + data.numberOfInstances + ")");
            diagram.model.commitTransaction(UPDATE_STATE_MACHINE);
            return state;

    }
    return state;
};