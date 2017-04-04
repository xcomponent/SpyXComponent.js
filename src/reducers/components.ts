import { INITIALIZATION, SET_CURRENT_COMPONENT, UPDATE_GRAPHIC, CLEAR_FINAL_STATES, SET_AUTO_CLEAR, GlobalComponentsAction, InitializationAction, SetCurrentComponentAction, UpdateGraphicAction, ClearFinalStatesAction, SetAutoClearAction } from "actions";
import * as go from "gojs";
import { DrawComponent } from "utils/drawComponent";
import { modelTags } from "utils/configurationParser";
import { activeStateColor, stateColor } from "utils/graphicColors";
import { Reducer } from "redux";

export interface Instance {
    jsonMessage: any;
    stateMachineRef: any;
    isFinal: boolean;
};

export interface ComponentProperties {
    diagram: go.Diagram;
    stateMachineProperties: { [name: string]: { [id: number]: Instance } };
    finalStates: string[];
    entryPointState: string;
};

export interface ComponentsState {
    componentProperties: { [componentName: string]: ComponentProperties };
    currentComponent: string;
    projectName: string;
    initialized: boolean;
    autoClear: boolean;
};

const initialState: ComponentsState = {
    componentProperties: {},
    currentComponent: undefined,
    projectName: undefined,
    initialized: false,
    autoClear: false
};

const updateState = (diagram: go.Diagram, stateKey: string, finalStates: string[], entryPointState: string, increment: number) => {
    const data = diagram.findNodeForKey(stateKey).data;
    const oldValue = data.numberOfStates;
    const newValue = oldValue + increment;
    diagram.model.setDataProperty(data, "numberOfStates", newValue);
    diagram.model.setDataProperty(data, "text", `${data.stateName} (${data.numberOfStates})`);
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

const clearFinalStates = (diagram: go.Diagram, finalStatesToClear: string[], stateMachine: string, numberOfInstances: number) => {
    diagram.model.startTransaction(CLEAR_FINAL_STATES);
    const stateMachineData = diagram.findNodeForKey(stateMachine).data;
    diagram.model.setDataProperty(stateMachineData, "numberOfInstances", numberOfInstances);
    diagram.model.setDataProperty(stateMachineData, "text", `${stateMachineData.key} (${stateMachineData.numberOfInstances})`);
    for (let i = 0; i < finalStatesToClear.length; i++) {
        const stateData = diagram.findNodeForKey(finalStatesToClear[i]).data;
        // change number in state
        diagram.model.setDataProperty(stateData, "numberOfStates", 0);
        diagram.model.setDataProperty(stateData, "text", `${stateData.stateName} (${stateData.numberOfStates})`);
    }
    diagram.model.commitTransaction(CLEAR_FINAL_STATES);
};

export const componentsReducer: Reducer<ComponentsState> = (state: ComponentsState = initialState, action: GlobalComponentsAction): ComponentsState => {
    let componentProperties;
    let diagram: go.Diagram;
    switch (action.type) {
        case INITIALIZATION:
            const initAction = <InitializationAction>action;
            return {
                ...state,
                componentProperties: initAction.componentProperties,
                currentComponent: initAction.currentComponent,
                projectName: initAction.projectName,
                initialized: true
            };
        case SET_CURRENT_COMPONENT:
            const setCurrentComponentAction = <InitializationAction>action;
            return {
                ...state,
                currentComponent: setCurrentComponentAction.currentComponent
            };
        case UPDATE_GRAPHIC:
            const updateGraphicAction = <UpdateGraphicAction>action;
            componentProperties = { ...state.componentProperties };
            diagram = componentProperties[updateGraphicAction.component].diagram;
            const stateMachineId = updateGraphicAction.data.stateMachineRef.StateMachineId;
            const instances = componentProperties[updateGraphicAction.component].stateMachineProperties[updateGraphicAction.stateMachine];
            const nodeData = diagram.findNodeForKey(updateGraphicAction.stateMachine).data;
            const newState = updateGraphicAction.data.stateMachineRef.StateName;
            const newStateKey = updateGraphicAction.stateMachine + modelTags.Separator + newState;
            const finalStates = componentProperties[updateGraphicAction.component].finalStates;
            const entryPointState = componentProperties[updateGraphicAction.component].entryPointState;
            diagram.model.startTransaction(UPDATE_GRAPHIC);
            if (instances[stateMachineId]) {
                const oldState = instances[stateMachineId].stateMachineRef.StateName;
                if (oldState !== newState) {
                    updateState(diagram, newStateKey, finalStates, entryPointState, +1);
                    updateState(diagram, updateGraphicAction.stateMachine + modelTags.Separator + oldState, finalStates, entryPointState, -1);
                }
            } else {
                diagram.model.setDataProperty(nodeData, "numberOfInstances", nodeData.numberOfInstances + 1);
                updateState(diagram, newStateKey, finalStates, entryPointState, +1);
            }
            const instance: Instance = {
                jsonMessage: updateGraphicAction.data.jsonMessage,
                stateMachineRef: updateGraphicAction.data.stateMachineRef,
                isFinal: componentProperties[updateGraphicAction.component].finalStates.indexOf(newStateKey) > -1
            };
            instances[stateMachineId] = instance;
            diagram.model.setDataProperty(nodeData, "numberOfInstances", nodeData.numberOfInstances);
            diagram.model.setDataProperty(nodeData, "text", `${nodeData.key} (${nodeData.numberOfInstances})`);
            diagram.model.commitTransaction(UPDATE_GRAPHIC);
            return {
                ...state,
                componentProperties: componentProperties
            };
        case CLEAR_FINAL_STATES:
            const clearFinalStatesAction = <ClearFinalStatesAction>action;
            const finalStatesToClear = [];
            componentProperties = { ...state.componentProperties };
            diagram = componentProperties[clearFinalStatesAction.component].diagram;
            const stateMachineInstances = componentProperties[clearFinalStatesAction.component].stateMachineProperties[clearFinalStatesAction.stateMachine];
            for (const id in stateMachineInstances) {
                if (stateMachineInstances[id].isFinal) {
                    const stateKey = clearFinalStatesAction.stateMachine + modelTags.Separator + stateMachineInstances[id].stateMachineRef.StateName;
                    finalStatesToClear.push(stateKey);
                    delete stateMachineInstances[id];
                }
            }
            clearFinalStates(diagram, finalStatesToClear, clearFinalStatesAction.stateMachine, Object.keys(stateMachineInstances).length);
            return {
                ...state,
                componentProperties: componentProperties
            };
        case SET_AUTO_CLEAR:
            const setAutoClearAction = <SetAutoClearAction>action;
            return {
                ...state,
                autoClear: setAutoClearAction.autoClear
            };
    }
    return state;
};