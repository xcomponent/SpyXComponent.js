import { GET_API_LIST, SELECT_API, FORM_SUBMIT, GlobalConfigFormAction, GetApiListAction, SelectApiAction, FormSubmitAction } from "actions/configForm";
import { Reducer } from "redux";

export interface ConfigFormState {
    apis: string[];
    selectedApi: string;
    serverUrl: string;
    formSubmited: boolean;
};

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

export const configFormReducer: Reducer<ConfigFormState> = (state: ConfigFormState = initialState, action: GlobalConfigFormAction = defaultAction): ConfigFormState => {
    switch (action.type) {
        case GET_API_LIST:
            let getApiListAction = <GetApiListAction>action;
            return {
                ...state,
                serverUrl: getApiListAction.serverUrl,
                apis: getApiListAction.apis,
                selectedApi: getApiListAction.apis[0]
            };
        case SELECT_API:
            let selectApiAction = <SelectApiAction>action;
            return {
                ...state,
                selectedApi: selectApiAction.selectedApi
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