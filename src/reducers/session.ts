import { Reducer, Action } from "redux";
import { INIT_SESSION, InitSessionAction } from "actions";
import sessionXCSpy from "utils/sessionXCSpy";

export interface SessionState {
    initialized: boolean;
};

const initialState: SessionState = {
    initialized: false
};

export const sessionReducer: Reducer<SessionState> = (state: SessionState = initialState, action: InitSessionAction): SessionState => {
    switch (action.type) {
        case INIT_SESSION:
            sessionXCSpy.init(action.api, action.serverUrl);
            return {
                ...state,
                initialized: true
            };
    }
    return state;
};