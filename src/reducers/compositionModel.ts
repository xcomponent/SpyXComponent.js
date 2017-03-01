import { INIT_COMPOSITION_MODEL } from "actions/compositionModel";

const initialState = {
    initialized: false,
    value: undefined
};

const defaultAction = {
    type: undefined,
    initialized: undefined,
    compositionModel: undefined
};

export const compositionModelReducer = (state = initialState, action = defaultAction) => {
    switch (action.type) {
        case INIT_COMPOSITION_MODEL:
            return {
                initialized: true,
                value: action.compositionModel
            };
    }
    return state;
};