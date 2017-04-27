import { combineReducers } from "redux";
import { configFormReducer, ConfigFormState } from "reducers/configForm";
import { compositionModelReducer, CompositionModelState } from "reducers/compositionModel";
import { componentsReducer, ComponentsState } from "reducers/components";
import { stateMachinePropertiesReducer, StateMachinePropertiesState } from "reducers/stateMachineProperties";
import { sideBarReducer, SideBarState } from "reducers/sideBar";
import { transitionPropertiesReducer, TransitionPropertiesState } from "reducers/transitionProperties";
import { sessionReducer, SessionState } from "reducers/session";

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