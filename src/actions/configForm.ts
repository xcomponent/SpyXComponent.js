import xcomponentapi from "reactivexcomponent.js";

export const GET_API_LIST = "GET_API_LIST";
export const SELECT_API = "SELECT_API";
export const FORM_SUBMIT = "FORM_SUBMIT";

export const getApiList = (serverUrl) => {
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

export const selectApi = (selectedApi) => {
    return {
        type: SELECT_API,
        selectedApi
    };
};

export const formSubmit = () => {
    return {
        type: FORM_SUBMIT
    };
};