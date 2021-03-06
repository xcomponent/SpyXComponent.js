import { Reducer, Action } from "redux";
import { SHOW_SIDE_BAR, HIDE_SIDE_BAR, GlobalSideBarAction } from "../actions";

export interface SideBarState {
    isVisible: boolean;
}

const initialState: SideBarState = {
    isVisible: true
};

export const sideBarReducer: Reducer<SideBarState> = (state: SideBarState = initialState, action: GlobalSideBarAction): SideBarState => {
    switch (action.type) {
        case SHOW_SIDE_BAR:
            return {
                ...state,
                isVisible: true
            };
        case HIDE_SIDE_BAR:
            return {
                ...state,
                isVisible: false
            };
    }
    return state;
};