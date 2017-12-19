import * as go from "../gojs/go";
import { INIT_COMPOSITION_MODEL, GlobalCompositionModelAction } from "../actions";
import { Reducer } from "redux";
import { xcMessages } from "reactivexcomponent.js/lib/types";

export interface CompositionModelState {
    initialized: boolean;
    value: xcMessages.CompositionModel;
}

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
