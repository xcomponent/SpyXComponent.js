import { INIT_COMPOSITION_MODEL } from "actions/compositionModel";

const initialState = {
    initialized: false,
    value: undefined
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