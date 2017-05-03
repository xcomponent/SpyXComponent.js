import sessionXCSpy, { SessionXCSpy } from "utils/sessionXCSpy";
import { Dispatch } from "redux";
import { updateGraphic, INIT_COMPOSITION_MODEL, initCompositionModelAction } from "actions";
import { XCSpyState } from "reducers/SpyReducer";
import xcomponentapi, { Session, xcMessages, Connection } from "reactivexcomponent.js";

export const getCompositionModel = (dispatch: Dispatch<XCSpyState>, xcApiName: string, serverUrl: string): void => {
    xcomponentapi.getModel(xcApiName, serverUrl, (connection: Connection, compositionModel: xcMessages.CompositionModel) => {
        dispatch(initCompositionModelAction(compositionModel));
    });
};

export const subscribeAllStateMachines = (dispatch: Dispatch<XCSpyState>, component: string, stateMachines: string[]): void => {
    sessionXCSpy.PromiseCreateSession
        .then((session: Session) => {
            const subscriber = session.createSubscriber();
            for (let j = 0; j < stateMachines.length; j++) {
                if (!subscriber.canSubscribe(component, stateMachines[j]))
                    continue;
                ((stateMachine: string) => {
                    subscriber.subscribe(component, stateMachine, (data) => {
                        dispatch(updateGraphic(component, stateMachine, data));
                    });
                })(stateMachines[j]);
            }
        });
};

export const snapshotEntryPoint = (dispatch: Dispatch<XCSpyState>, component: string, entryPoint: string): void => {
    sessionXCSpy.PromiseCreateSession
        .then((session: Session) => {
            session.createSubscriber().getSnapshot(component, entryPoint, (items: xcMessages.Packet[]) => {
                for (let i = 0; i < items.length; i++) {
                    dispatch(updateGraphic(component, entryPoint, items[i]));
                }
            });
        });
};

export const snapshot = (dispatch: Dispatch<XCSpyState>, currentComponent: string, stateMachine: string): void => {
    sessionXCSpy.PromiseCreateSession
        .then((session: Session) => {
            session.createSubscriber().getSnapshot(currentComponent, stateMachine, (items: xcMessages.Packet[]) => {
                for (let i = 0; i < items.length; i++) {
                    dispatch(updateGraphic(currentComponent, stateMachine, items[i]));
                }
                console.log(items);
            });
        });
};

export const snapshotAll = (dispatch: Dispatch<XCSpyState>, component: string, stateMachines: string[]): void => {
    sessionXCSpy.PromiseCreateSession
        .then((session: Session) => {
            const subscriber = session.createSubscriber();
            for (let i = 0; i < stateMachines.length; i++) {
                subscriber.getSnapshot(component, stateMachines[i], (items: xcMessages.Packet[]) => {
                    console.log(items);
                    for (let j = 0; j < items.length; j++) {
                        dispatch(updateGraphic(component, stateMachines[i], items[j]));
                    }
                });
            }
        });
};

export const send = (component: string, stateMachine: string, messageType: string, jsonMessageString: string, privateTopic: string = undefined) => {
    sessionXCSpy.PromiseCreateSession
        .then((session: Session) => {
            const publisher = session.createPublisher();
            let jsonMessage;
            try {
                jsonMessage = JSON.parse(jsonMessageString);
                if (!privateTopic || privateTopic.length === 0) {
                    publisher.send(component, stateMachine, messageType, jsonMessage, false, null);
                } else {
                    if (session.getPrivateTopics().indexOf(privateTopic) === -1)
                        session.addPrivateTopic(privateTopic);
                    publisher.send(component, stateMachine, messageType, jsonMessage, true, privateTopic);
                }
            } catch (e) {
                alert("Json format incorrect");
                console.error(e);
            }
        });
};

export const sendContext = (stateMachineRef: xcMessages.StateMachineRef, messageType: string, jsonMessageString: string, privateTopic: string = undefined): void => {
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
                    if (session.getPrivateTopics().indexOf(privateTopic) === -1)
                        session.addPrivateTopic(privateTopic);
                    stateMachineRef.send(messageType, jsonMessage, true, privateTopic);
                }
            } catch (e) {
                alert("Json format incorrect");
                console.error(e);
            }
        });
};
