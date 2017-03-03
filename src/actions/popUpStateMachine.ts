export const SHOW_POP_UP = "SHOW_POP_UP";
export const HIDE_POP_UP = "HIDE_POP_UP";

export const showPopUp = (stateMachine) => {
    return {
        type: SHOW_POP_UP,
        stateMachine
    };
};

export const hidePopUp = () => {
    return {
        type: HIDE_POP_UP
    };
};