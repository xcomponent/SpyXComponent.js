import xcomponentapi from "reactivexcomponent.js";
import { Action } from "redux";

export const GET_API_LIST = "GET_API_LIST";
export const SELECT_API = "SELECT_API";
export const FORM_SUBMIT = "FORM_SUBMIT";

export type GlobalConfigFormAction = GetApiListAction | SelectApiAction;

export interface GetApiListAction extends Action {
    serverUrl: string;
    apis: string[];
};

export interface SelectApiAction extends Action {
    selectedApi: string;
};

export const getApiList = (serverUrl: string) => {
    return (dispatch) => {
        xcomponentapi.getXcApiList(serverUrl, (connection, apis) => {
            dispatch({
                type: GET_API_LIST,
                serverUrl,
                apis
            });
        });
    };
};

export const selectApi = (selectedApi: string): SelectApiAction => {
    return {
        type: SELECT_API,
        selectedApi
    };
};

export const formSubmit = (): Action => {
    return {
        type: FORM_SUBMIT
    };
};