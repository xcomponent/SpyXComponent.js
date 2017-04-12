import xcomponentapi from "reactivexcomponent.js";
import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

export const INIT_COMPOSITION_MODEL = "INIT_COMPOSITION_MODEL";

export interface GlobalCompositionModelAction extends Action {
    compositionModel: any;
};

export const setCompositionModel = (xcApiName: string, serverUrl: string): ThunkAction<void, void, void> => {
    return (dispatch) => {
        xcomponentapi.getModel(xcApiName, serverUrl, (connection, compositionModel) => {
            dispatch({
                type: INIT_COMPOSITION_MODEL,
                compositionModel
            });
        });
    };
};