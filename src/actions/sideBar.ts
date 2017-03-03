export const SHOW_SIDE_BAR = "SHOW_SIDE_BAR";
export const HIDE_SIDE_BAR = "HIDE_SIDE_BAR";

export const showSideBar = () => {
    return {
        type: SHOW_SIDE_BAR
    };
};

export const hideSideBar = () => {
    return {
        type: HIDE_SIDE_BAR
    };
};