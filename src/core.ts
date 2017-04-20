import sessionXCSpy from "utils/sessionXCSpy";
import { Dispatch } from "redux";
import { updateGraphic, INIT_COMPOSITION_MODEL } from "actions";
import { XCSpyState } from "reducers/SpyReducer";
import xcomponentapi from "reactivexcomponent.js";

export const getCompositionModel = (dispatch: Dispatch<XCSpyState>, xcApiName: string, serverUrl: string): void => {
    xcomponentapi.getModel(xcApiName, serverUrl, (connection, compositionModel) => {
        dispatch({
            type: INIT_COMPOSITION_MODEL,
            compositionModel
        });
    });
};

export const subscribeAllStateMachines = (dispatch: Dispatch<XCSpyState>, component: string, stateMachines: string[]): void => {
    sessionXCSpy.getPromiseCreateSession()
        .then((session) => {
            const subscriber = session.createSubscriber();
            for (let j = 0; j < stateMachines.length; j++) {
                if (!subscriber.canSubscribe(component, stateMachines[j]))
                    continue;
                ((stateMachine) => {
                    subscriber.subscribe(component, stateMachine, (data) => {
                        dispatch(updateGraphic(component, stateMachine, data));
                    });
                })(stateMachines[j]);
            }
        });
};

export const snapshotEntryPoint = (dispatch: Dispatch<XCSpyState>, component: string, entryPoint: string): void => {
    sessionXCSpy.getPromiseCreateSession()
        .then((session) => {
            session.createSubscriber().getSnapshot(component, entryPoint, (items) => {
                for (let i = 0; i < items.length; i++) {
                    dispatch(updateGraphic(component, entryPoint, items[i]));
                }
            });
        });
};

export const snapshot = (dispatch: Dispatch<XCSpyState>, currentComponent: string, stateMachine: string): void => {
    sessionXCSpy.getPromiseCreateSession()
        .then((session) => {
            session.createSubscriber().getSnapshot(currentComponent, stateMachine, (items) => {
                for (let i = 0; i < items.length; i++) {
                    dispatch(updateGraphic(currentComponent, stateMachine, items[i]));
                }
                console.log(items);
            });
        });
};

export const snapshotAll = (dispatch: Dispatch<XCSpyState>, component: string, stateMachines: string[]): void => {
    sessionXCSpy.getPromiseCreateSession()
        .then((session) => {
            const subscriber = session.createSubscriber();
            for (let i = 0; i < stateMachines.length; i++) {
                subscriber.getSnapshot(component, stateMachines[i], (items) => {
                    console.log(items);
                    for (let j = 0; j < items.length; j++) {
                        dispatch(updateGraphic(component, stateMachines[i], items[j]));
                    }
                });
            }
        });
};

export const send = (component: string, stateMachine: string, messageType: string, jsonMessageString: string) => {
    sessionXCSpy.getPromiseCreateSession()
        .then((session) => {
            const publisher = session.createPublisher();
            let jsonMessage;
            try {
                jsonMessage = JSON.parse(jsonMessageString);
                publisher.send(component, stateMachine, messageType, jsonMessage);
            } catch (e) {
                alert("Json format incorrect");
                console.error(e);
            }
        });
};

export const sendContext = (stateMachineRef: any, messageType: string, jsonMessageString: string): void => {
    if (!stateMachineRef) {
        alert("Please select an instance!");
        return;
    }
    let jsonMessage;
    try {
        jsonMessage = JSON.parse(jsonMessageString);
        stateMachineRef.send(messageType, jsonMessage);
    } catch (e) {
        alert("Json format incorrect");
        console.error(e);
    }
};
