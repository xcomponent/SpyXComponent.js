import xcomponentapi from "reactivexcomponent.js";

export const INIT_COMPOSITION_MODEL = "INIT_COMPOSITION_MODEL";


export const setCompositionModel = (xcApiName, serverUrl) => {
    return (dispatch) => {
        xcomponentapi.getModel(xcApiName, serverUrl, (connection, compositionModel) => {
            dispatch({
                type: INIT_COMPOSITION_MODEL,
                compositionModel
            });
        });
    };
};