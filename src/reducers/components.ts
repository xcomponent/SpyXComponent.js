import { INITIALIZATION, SET_CURRENT_COMPONENT, UPDATE_GRAPHIC } from "actions/components";
import * as go from "gojs";
import { DrawComponent } from "utils/drawComponent";
import { modelTags } from "utils/configurationParser";

interface Instance {
    jsonMessage: any;
    stateMachineRef: any;
};

interface ComponentProperties {
    diagram: go.Diagram;
    stateMachineProperties: { [name: string]: { [id: number]: Instance } };
};

interface Components {
    componentProperties: { [componentName: string]: ComponentProperties };
    currentComponent: string;
    projectName: string;
    initialized: boolean;
};

const initialState = {
    componentProperties: {},
    currentComponent: undefined,
    projectName: undefined,
    initialized: false
};

const updateState = (diagram, stateKey, increment) => {
    let data = diagram.findNodeForKey(stateKey).data;
    let oldValue = data.numberOfStates;
    let newValue = oldValue + increment;
    diagram.model.setDataProperty(data, "numberOfStates", newValue);
    diagram.model.setDataProperty(data, "text", data.stateName + " (" + data.numberOfStates + ")");
    // Must change color in those cases if (oldValue === 0 || newValue === 0) {
    if (newValue === 0) {
        diagram.model.setDataProperty(data, "fill", "lightgray");
        diagram.model.setDataProperty(data, "stroke", "black");
    } else {
        diagram.model.setDataProperty(data, "fill", "red");
        diagram.model.setDataProperty(data, "stroke", "red");
    }
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
        case UPDATE_GRAPHIC:
            let componentProperties = { ...state.componentProperties };
            let diagram: go.Diagram = componentProperties[action.component].diagram;
            let stateMachineId = action.data.stateMachineRef.StateMachineId;
            let instances = componentProperties[action.component].stateMachineProperties[action.stateMachine];
            let nodeData = diagram.findNodeForKey(action.stateMachine).data;
            let newState = action.data.stateMachineRef.StateName;
            diagram.model.startTransaction(UPDATE_GRAPHIC);
            if (instances[stateMachineId]) {
                let oldState = instances[stateMachineId].stateMachineRef.StateName;
                if (oldState !== newState) {
                    updateState(diagram, action.stateMachine + modelTags.Separator + newState, +1);
                    updateState(diagram, action.stateMachine + modelTags.Separator + oldState, -1);
                }
            } else {
                diagram.model.setDataProperty(nodeData, "numberOfInstances", nodeData.numberOfInstances + 1);
                updateState(diagram, action.stateMachine + modelTags.Separator + newState, +1);
            }
            instances[stateMachineId] = action.data;
            diagram.model.setDataProperty(nodeData, "numberOfInstances", nodeData.numberOfInstances);
            diagram.model.setDataProperty(nodeData, "text", nodeData.key + " (" + nodeData.numberOfInstances + ")");
            diagram.model.commitTransaction(UPDATE_GRAPHIC);
            return {
                ...state,
                componentProperties: componentProperties
            };
    }
    return state;
};