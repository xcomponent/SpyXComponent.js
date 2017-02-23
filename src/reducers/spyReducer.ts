import { combineReducers } from "redux";
import { configFormReducer } from "reducers/configForm";

export const SpyReducer = combineReducers({
    configForm: configFormReducer
});