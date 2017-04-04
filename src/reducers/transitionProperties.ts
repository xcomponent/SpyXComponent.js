import { HIDE_TRANSITION_PROPERTIES, SHOW_TRANSITION_PROPERTIES, SET_JSON_MESSAGE_STRING, SET_CURRENT_ID, SET_PRIVATE_TOPIC, GlobalTransitionPropertiesAction, ShowTransitionPropertiesAction, HideTransitionPropertiesAction, SetJsonMessageStringAction, SetCurrentIdAction, SetPrivateTopicAction } from "actions";
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
            let showTransitionPropertiesAction = <ShowTransitionPropertiesAction>action;
            return {
                ...state,
                active: true,
                stateMachine: showTransitionPropertiesAction.stateMachine,
                messageType: showTransitionPropertiesAction.messageType,
                jsonMessageString: showTransitionPropertiesAction.jsonMessageString,
                id: showTransitionPropertiesAction.id,
                privateTopic: showTransitionPropertiesAction.privateTopic
            };
        case SET_JSON_MESSAGE_STRING:
            let setJsonMessageStringAction = <SetJsonMessageStringAction>action;
            return {
                ...state,
                jsonMessageString: setJsonMessageStringAction.jsonMessageString
            };
        case SET_CURRENT_ID:
            let setCurrentIdAction = <SetCurrentIdAction>action;
            return {
                ...state,
                id: setCurrentIdAction.id
            };
        case SET_PRIVATE_TOPIC:
            let setPrivateTopicAction = <SetPrivateTopicAction>action;
            return {
                ...state,
                privateTopic: setPrivateTopicAction.privateTopic
            };
    }
    return state;
};
