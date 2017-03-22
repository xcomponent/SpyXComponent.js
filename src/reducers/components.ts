import { INITIALIZATION, SET_CURRENT_COMPONENT, UPDATE_GRAPHIC, CLEAR_FINAL_STATES } from "actions/components";
import * as go from "gojs";
import { DrawComponent } from "utils/drawComponent";
import { modelTags } from "utils/configurationParser";
import { activeStateColor, stateColor } from "utils/graphicColors";

interface Instance {
    jsonMessage: any;
    stateMachineRef: any;
    isFinal: boolean;
};

interface ComponentProperties {
    diagram: go.Diagram;
    stateMachineProperties: { [name: string]: { [id: number]: Instance } };
    finalStates: Array<String>;
    entryPointState: string;
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

const updateState = (diagram, stateKey, finalStates, entryPointState, increment) => {
    let data = diagram.findNodeForKey(stateKey).data;
    let oldValue = data.numberOfStates;
    let newValue = oldValue + increment;
    diagram.model.setDataProperty(data, "numberOfStates", newValue);
    diagram.model.setDataProperty(data, "text", data.stateName + " (" + data.numberOfStates + ")");
    if (finalStates.indexOf(stateKey) > -1 || entryPointState === stateKey)
        return;
    if (newValue === 0) {
        diagram.model.setDataProperty(data, "fill", stateColor);
        diagram.model.setDataProperty(data, "stroke", stateColor);
    } else {
        diagram.model.setDataProperty(data, "fill", activeStateColor);
        diagram.model.setDataProperty(data, "stroke", activeStateColor);
    }
};

const clearFinalStates = (diagram, finalStatesToClear, stateMachine, numberOfInstances) => {
    diagram.model.startTransaction(CLEAR_FINAL_STATES);
    let stateMachineData = diagram.findNodeForKey(stateMachine).data;
    diagram.model.setDataProperty(stateMachineData, "numberOfInstances", numberOfInstances);
    diagram.model.setDataProperty(stateMachineData, "text", stateMachineData.key + " (" + stateMachineData.numberOfInstances + ")");
    for (let i = 0; i < finalStatesToClear.length; i++) {
        let stateData = diagram.findNodeForKey(finalStatesToClear[i]).data;
        // change number in state
        diagram.model.setDataProperty(stateData, "numberOfStates", 0);
        diagram.model.setDataProperty(stateData, "text", stateData.stateName + " (" + stateData.numberOfStates + ")");
    }
    diagram.model.commitTransaction(CLEAR_FINAL_STATES);
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
            let newStateKey = action.stateMachine + modelTags.Separator + newState;
            let finalStates = componentProperties[action.component].finalStates;
            let entryPointState = componentProperties[action.component].entryPointState;
            diagram.model.startTransaction(UPDATE_GRAPHIC);
            if (instances[stateMachineId]) {
                let oldState = instances[stateMachineId].stateMachineRef.StateName;
                if (oldState !== newState) {
                    updateState(diagram, newStateKey, finalStates, entryPointState, +1);
                    updateState(diagram, action.stateMachine + modelTags.Separator + oldState, finalStates, entryPointState, -1);
                }
            } else {
                diagram.model.setDataProperty(nodeData, "numberOfInstances", nodeData.numberOfInstances + 1);
                updateState(diagram, newStateKey, finalStates, entryPointState, +1);
            }
            let instance: Instance = {
                jsonMessage: action.data.jsonMessage,
                stateMachineRef: action.data.stateMachineRef,
                isFinal: componentProperties[action.component].finalStates.indexOf(newStateKey) > -1
            };
            instances[stateMachineId] = instance;
            diagram.model.setDataProperty(nodeData, "numberOfInstances", nodeData.numberOfInstances);
            diagram.model.setDataProperty(nodeData, "text", nodeData.key + " (" + nodeData.numberOfInstances + ")");
            diagram.model.commitTransaction(UPDATE_GRAPHIC);
            return {
                ...state,
                componentProperties: componentProperties
            };
        case CLEAR_FINAL_STATES:
            let finalStatesToClear = [];
            componentProperties = { ...state.componentProperties };
            diagram = componentProperties[action.component].diagram;
            let stateMachineInstances = componentProperties[action.component].stateMachineProperties[action.stateMachine];
            for (let id in stateMachineInstances) {
                if (stateMachineInstances[id].isFinal) {
                    let stateKey = action.stateMachine + modelTags.Separator + stateMachineInstances[id].stateMachineRef.StateName;
                    finalStatesToClear.push(stateKey);
                    delete stateMachineInstances[id];
                }
            }
            clearFinalStates(diagram, finalStatesToClear, action.stateMachine, Object.keys(stateMachineInstances).length);
            return {
                ...state,
                componentProperties: componentProperties
            };
    }
    return state;
};