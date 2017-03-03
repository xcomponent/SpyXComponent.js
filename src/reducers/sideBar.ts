import { SHOW_SIDE_BAR, HIDE_SIDE_BAR } from "actions/sideBar";

const initialState = true;

const defaultAction = {
    type: undefined
};

export const sideBarReducer = (state = initialState, action = defaultAction) => {
    switch (action.type) {
        case SHOW_SIDE_BAR:
            return true;
        case HIDE_SIDE_BAR:
            return false;
    }
    return state;
};