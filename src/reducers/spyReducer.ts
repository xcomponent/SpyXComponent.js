import { combineReducers } from "redux";
import { configFormReducer } from "reducers/configForm";
import { compositionModelReducer } from "reducers/compositionModel";
import { componentsReducer } from "reducers/components";

export const SpyReducer = combineReducers({
    configForm: configFormReducer,
    compositionModel: compositionModelReducer,
    components: componentsReducer
});