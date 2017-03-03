import * as go from "gojs";
import { INIT_COMPOSITION_MODEL } from "actions/compositionModel";

const initialState = {
    initialized: false,
    value: undefined
};

const defaultAction = {
    type: undefined,
    initialized: undefined,
    compositionModel: undefined,
    component: undefined,
    stateMachine: undefined
};

export const compositionModelReducer = (state = initialState, action) => {
    switch (action.type) {
        case INIT_COMPOSITION_MODEL:
            return {
                initialized: true,
                value: action.compositionModel
            };
    }
    return state;
};
