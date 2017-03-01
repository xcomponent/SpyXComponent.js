import { GET_API_LIST, SELECT_API, FORM_SUBMIT } from "actions/configForm";

const initialState = {
    apis: [],
    selectedApi: undefined,
    serverUrl: undefined,
    formSubmited: false
};

const defaultAction = {
    type: undefined,
    serverUrl: undefined,
    apis: undefined,
    selectedApi: undefined
};

export const configFormReducer = (state = initialState, action = defaultAction) => {
    switch (action.type) {
        case GET_API_LIST:
            return {
                ...state,
                serverUrl: action.serverUrl,
                apis: action.apis,
                selectedApi: action.apis[0]
            };
        case SELECT_API:
            return {
                ...state,
                selectedApi: action.selectedApi
            };
        case FORM_SUBMIT:
            if (state.serverUrl && state.selectedApi) {
                return {
                    ...state,
                    formSubmited: true
                };
            } else {
                return state;
            }
    }
    return state;
};