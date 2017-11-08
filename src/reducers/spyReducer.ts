import { combineReducers } from "redux";
import { configFormReducer, ConfigFormState } from "./configForm";
import { compositionModelReducer, CompositionModelState } from "./compositionModel";
import { componentsReducer, ComponentsState } from "./components";
import { stateMachinePropertiesReducer, StateMachinePropertiesState } from "./stateMachineProperties";
import { sideBarReducer, SideBarState } from "./sideBar";
import { transitionPropertiesReducer, TransitionPropertiesState } from "./transitionProperties";
import { sessionReducer, SessionState } from "./session";

export interface XCSpyState {
    configForm: ConfigFormState;
    compositionModel: CompositionModelState;
    components: ComponentsState;
    stateMachineProperties: StateMachinePropertiesState;
    sideBar: SideBarState;
    transitionProperties: TransitionPropertiesState;
    session: SessionState;
};

export const SpyReducer = combineReducers({
    configForm: configFormReducer,
    compositionModel: compositionModelReducer,
    components: componentsReducer,
    stateMachineProperties: stateMachinePropertiesReducer,
    sideBar: sideBarReducer,
    transitionProperties: transitionPropertiesReducer,
    session: sessionReducer
});