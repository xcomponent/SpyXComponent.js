import sessionXCSpy, { SessionXCSpy } from "./utils/sessionXCSpy";
import { Dispatch } from "redux";
import { updateGraphic, INIT_COMPOSITION_MODEL, initCompositionModelAction } from "./actions";
import { XCSpyState } from "reducers/spyReducer";
import xcomponentapi, { Session, Connection, StateMachineRef, CompositionModel } from "reactivexcomponent.js";

export const getCompositionModel = (dispatch: Dispatch<XCSpyState>, api: string, serverUrl: string): void => {
    sessionXCSpy.getCompositionModel(serverUrl, api).then(compositionModel => {
        dispatch(initCompositionModelAction(compositionModel));
    });
};

export const subscribeAllStateMachines = (dispatch: Dispatch<XCSpyState>, component: string, stateMachines: string[]): void => {
    sessionXCSpy.PromiseCreateSession
        .then((session: Session) => {
            for (let j = 0; j < stateMachines.length; j++) {
                if (!session.canSubscribe(component, stateMachines[j]))
                    continue;
                ((stateMachine: string) => {
                    session.subscribe(component, stateMachine, { onStateMachineUpdate : (data) => {
                        dispatch(updateGraphic(component, stateMachine, data));
                    }});
                })(stateMachines[j]);
            }
        });
};

export const snapshotEntryPoint = (dispatch: Dispatch<XCSpyState>, component: string, entryPoint: string): void => {
    snapshot(dispatch, component, entryPoint);
};

export const snapshot = (dispatch: Dispatch<XCSpyState>, component: string, stateMachine: string): void => {
    sessionXCSpy.PromiseCreateSession
        .then((session: Session) => {
            session.getSnapshot(component, stateMachine).then(snapshot => {
                snapshot.forEach(element => {
                    dispatch(updateGraphic(component, stateMachine, element));
                });
            });
        });
};

export const snapshotAll = (dispatch: Dispatch<XCSpyState>, component: string, stateMachines: string[]): void => {
    stateMachines.forEach(stateMachine => {
        snapshot(dispatch, component, stateMachine);
    });
};

export const send = (component: string, stateMachine: string, messageType: string, jsonMessageString: string, privateTopic: string = undefined) => {
    sessionXCSpy.PromiseCreateSession
        .then((session: Session) => {
            let jsonMessage;
            try {
                jsonMessage = JSON.parse(jsonMessageString);
                if (!privateTopic || privateTopic.length === 0) {
                    session.send(component, stateMachine, messageType, jsonMessage, false, null);
                } else {
                    if (session.privateTopics.getSubscriberTopics().indexOf(privateTopic) === -1)
                        session.privateTopics.addSubscriberTopic(privateTopic);
                        session.send(component, stateMachine, messageType, jsonMessage, true, privateTopic);
                }
            } catch (e) {
                alert("Json format incorrect");
                console.error(e);
            }
        });
};

export const sendContext = (stateMachineRef: StateMachineRef, messageType: string, jsonMessageString: string, privateTopic: string = undefined): void => {
    sessionXCSpy.PromiseCreateSession
        .then((session: Session) => {
            if (!stateMachineRef) {
                alert("Please select an instance!");
                return;
            }
            let jsonMessage;
            try {
                jsonMessage = JSON.parse(jsonMessageString);
                if (!privateTopic || privateTopic.length === 0) {
                    stateMachineRef.send(messageType, jsonMessage, false, null);
                } else {
                    if (session.privateTopics.getSubscriberTopics().indexOf(privateTopic) === -1)
                        session.privateTopics.addSubscriberTopic(privateTopic);
                    stateMachineRef.send(messageType, jsonMessage, true, privateTopic);
                }
            } catch (e) {
                alert("Json format incorrect");
                console.error(e);
            }
        });
};