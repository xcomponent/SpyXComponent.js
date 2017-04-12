import { Action } from "redux";

export const SHOW_SIDE_BAR = "SHOW_SIDE_BAR";
export const HIDE_SIDE_BAR = "HIDE_SIDE_BAR";

export type GlobalSideBarAction = Action;

export const showSideBar = (): GlobalSideBarAction => {
    return {
        type: SHOW_SIDE_BAR
    };
};

export const hideSideBar = (): GlobalSideBarAction => {
    return {
        type: HIDE_SIDE_BAR
    };
};