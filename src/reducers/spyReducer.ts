import { combineReducers } from "redux";
import { configFormReducer } from "reducers/configForm";
import { compositionModelReducer } from "reducers/compositionModel";
import { componentsReducer } from "reducers/components";
import { stateMachinePropertiesReducer } from "reducers/stateMachineProperties";
import { sideBarReducer } from "reducers/sideBar";

export const SpyReducer = combineReducers({
    configForm: configFormReducer,
    compositionModel: compositionModelReducer,
    components: componentsReducer,
    stateMachineProperties: stateMachinePropertiesReducer,
    sideBar: sideBarReducer
});