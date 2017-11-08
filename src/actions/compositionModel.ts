import xcomponentapi, { xcMessages } from "reactivexcomponent.js";
import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { getCompositionModel } from "../core";
import { Dispatch } from "redux";
import { XCSpyState } from "reducers/spyReducer";

export const INIT_COMPOSITION_MODEL = "INIT_COMPOSITION_MODEL";

export interface GlobalCompositionModelAction extends Action {
    compositionModel: xcMessages.CompositionModel;
};

export const initCompositionModelAction = (compositionModel): GlobalCompositionModelAction => {
    return {
        type: INIT_COMPOSITION_MODEL,
        compositionModel
    };
};

export const setCompositionModel = (xcApiName: string, serverUrl: string): ThunkAction<void, void, void> => {
    return (dispatch: Dispatch<XCSpyState>): void => {
        getCompositionModel(dispatch, xcApiName, serverUrl);
    };
};