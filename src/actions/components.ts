import { Action } from "redux";
import { ComponentProperties } from "reducers/components";
import { ThunkAction } from "redux-thunk";
import { Dispatch } from "redux";
import { XCSpyState } from "reducers/SpyReducer";
import { snapshotEntryPoint, subscribeAllStateMachines } from "core";
import { xcMessages } from "reactivexcomponent.js";

export const INITIALIZATION = "INITIALIZATION";
export const SET_CURRENT_COMPONENT = "SET_CURRENT_COMPONENT";
export const UPDATE_GRAPHIC = "UPDATE_GRAPHIC";
export const CLEAR_FINAL_STATES = "CLEAR_FINAL_STATES";
export const SET_AUTO_CLEAR = "SET_AUTO_CLEAR";

export type GlobalComponentsAction = InitializationAction | UpdateGraphicAction | ClearFinalStatesAction | SetAutoClearAction;

export interface InitializationAction extends Action {
    componentProperties: { [componentName: string]: ComponentProperties };
    projectName: string;
};

export interface UpdateGraphicAction extends Action {
    data: xcMessages.Packet;
    component: string;
    stateMachine: string;
};

export interface ClearFinalStatesAction extends Action {
    component: string;
    stateMachine: string;
};

export interface SetAutoClearAction extends Action {
    autoClear: boolean;
};

export const initialization = (componentProperties: { [componentName: string]: ComponentProperties }, currentComponent: string, projectName: string): InitializationAction => {
    return {
        type: INITIALIZATION,
        componentProperties,
        projectName
    };
};


export const updateGraphic = (component: string, stateMachine: string, data: xcMessages.Packet): ThunkAction<void, void, void> => {
    return (dispatch: Dispatch<XCSpyState>, getState: () => XCSpyState): void => {
        dispatch({
            type: UPDATE_GRAPHIC,
            component,
            stateMachine,
            data
        });
        if (getState().components.autoClear) {
            dispatch(clearFinalStates(component, stateMachine));
        }
    };
};

export const clearFinalStates = (component: string, stateMachine: string): ClearFinalStatesAction => {
    return {
        type: CLEAR_FINAL_STATES,
        component,
        stateMachine
    };
};

export const setAutoClear = (autoClear: boolean): SetAutoClearAction => {
    return {
        type: SET_AUTO_CLEAR,
        autoClear
    };
};

export const subscribeAllStateMachinesAction = (component: string, stateMachines: string[]): ThunkAction<void, XCSpyState, void> => {
    return (dispatch: Dispatch<XCSpyState>): void => {
        subscribeAllStateMachines(dispatch, component, stateMachines);
    };
};

export const snapshotEntryPointAction = (component: string, entryPoint: string): ThunkAction<void, XCSpyState, void> => {
    return (dispatch: Dispatch<XCSpyState>): void => {
        snapshotEntryPoint(dispatch, component, entryPoint);
    };
};