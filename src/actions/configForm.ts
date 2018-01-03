import sessionXCSpy from "../utils/sessionXCSpy";
import { Action, Dispatch } from "redux";
import { XCSpyState } from "reducers/spyReducer";

export const GET_API_LIST = "GET_API_LIST";
export const SELECT_API = "SELECT_API";
export const FORM_SUBMIT = "FORM_SUBMIT";
export const SET_SERVER_URL = "SET_SERVER_URL";
export type GlobalConfigFormAction = GetApiListAction | SelectApiAction | SetServerUrlAction;

export interface GetApiListAction extends Action {
    serverUrl: string;
    apis: string[];
}

export interface SelectApiAction extends Action {
    selectedApi: string;
}

export interface SetServerUrlAction extends Action {
    serverUrl: string;
}

export const getApiList = (serverUrl: string) => {
    return (dispatch) => {
        sessionXCSpy.getXcApiList(serverUrl).then(apis => {
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

export const setServerUrl = (serverUrl: string): SetServerUrlAction => {
    return {
        type: SET_SERVER_URL,
        serverUrl
    };
};