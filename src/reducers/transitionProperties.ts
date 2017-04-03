import { HIDE_TRANSITION_PROPERTIES, SHOW_TRANSITION_PROPERTIES, SET_JSON_MESSAGE_STRING, SET_CURRENT_ID, SET_PRIVATE_TOPIC, GlobalTransitionPropertiesAction } from "actions/transitionProperties";
import sessionXCSpy from "utils/sessionXCSpy";
import { Reducer } from "redux";

export interface TransitionPropertiesState {
    active: boolean;
    stateMachine: string;
    messageType: string;
    jsonMessageString: string;
    id: string;
    privateTopic: string;
};

let initialState: TransitionPropertiesState = {
    active: false,
    stateMachine: undefined,
    messageType: undefined,
    jsonMessageString: undefined,
    id: undefined,
    privateTopic: undefined
};

export const transitionPropertiesReducer: Reducer<TransitionPropertiesState> = (state: TransitionPropertiesState = initialState, action: GlobalTransitionPropertiesAction): TransitionPropertiesState => {
    switch (action.type) {
        case HIDE_TRANSITION_PROPERTIES:
            return {
                ...state,
                active: false
            };
        case SHOW_TRANSITION_PROPERTIES:
            return {
                ...state,
                active: true,
                stateMachine: action.stateMachine,
                messageType: action.messageType,
                jsonMessageString: action.jsonMessageString,
                id: action.id,
                privateTopic: action.privateTopic
            };
        case SET_JSON_MESSAGE_STRING:
            return {
                ...state,
                jsonMessageString: action.jsonMessageString
            };
        case SET_CURRENT_ID:
            return {
                ...state,
                id: action.id
            };
        case SET_PRIVATE_TOPIC:
            return {
                ...state,
                privateTopic: action.privateTopic
            };
    }
    return state;
};
