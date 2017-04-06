import { Action } from "redux";
import { ComponentProperties } from "reducers/components";
import { ThunkAction } from "redux-thunk";
import { Dispatch } from "redux";
import { XCSpyState } from "reducers/SpyReducer";

export const INITIALIZATION = "INITIALIZATION";
export const SET_CURRENT_COMPONENT = "SET_CURRENT_COMPONENT";
export const UPDATE_GRAPHIC = "UPDATE_GRAPHIC";
export const CLEAR_FINAL_STATES = "CLEAR_FINAL_STATES";
export const SET_AUTO_CLEAR = "SET_AUTO_CLEAR";

export type GlobalComponentsAction = InitializationAction | SetCurrentComponentAction | UpdateGraphicAction | ClearFinalStatesAction | SetAutoClearAction;

export interface InitializationAction extends Action {
    componentProperties: { [componentName: string]: ComponentProperties };
    currentComponent: string;
    projectName: string;
};

export interface SetCurrentComponentAction extends Action {
    currentComponent: string;
};

export interface UpdateGraphicAction extends Action {
    data: any; // comes from api
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
        currentComponent,
        projectName
    };
};

export const setCurrentComponent = (currentComponent: string): SetCurrentComponentAction => {
    return {
        type: SET_CURRENT_COMPONENT,
        currentComponent
    };
};

export const updateGraphic = (component: string, stateMachine: string, data: any): ThunkAction<void, void, void> => {
    return (dispatch: Dispatch<XCSpyState>, getState: () => XCSpyState) => {
        dispatch({
            type: UPDATE_GRAPHIC,
            component,
            stateMachine,
            data
        });
        if (getState().components.autoClear === true) {
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