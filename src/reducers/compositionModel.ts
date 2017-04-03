import * as go from "gojs";
import { INIT_COMPOSITION_MODEL, GlobalCompositionModelAction } from "actions/compositionModel";
import { Reducer } from "redux";

export interface CompositionModelState {
    initialized: boolean;
    value: any; // type comes from api
};

const initialState = {
    initialized: false,
    value: undefined
};

export const compositionModelReducer: Reducer<CompositionModelState> = (state: CompositionModelState = initialState, action: GlobalCompositionModelAction): CompositionModelState => {
    switch (action.type) {
        case INIT_COMPOSITION_MODEL:
            return {
                initialized: true,
                value: action.compositionModel
            };
    }
    return state;
};
