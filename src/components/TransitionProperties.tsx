import * as React from "react";
import { connect } from "react-redux";
import * as Layer from "grommet/components/Layer";
import { hideStateMachineProperties } from "actions/stateMachineProperties";
import * as Header from "grommet/components/Header";
import * as Title from "grommet/components/Title";
import * as Form from "grommet/components/Form";
import * as FormField from "grommet/components/FormField";
import * as Button from "grommet/components/Button";
import * as Footer from "grommet/components/Footer";
import sessionXCSpy from "utils/sessionXCSpy";
import { updateGraphic } from "actions/components";
import * as Select from "grommet/components/Select";
import { setStateMachineId } from "actions/stateMachineProperties";
import * as Box from "grommet/components/Box";
import { hideTransitionProperties, setJsonMessageString, setCurrentId } from "actions/transitionProperties";
import Instances from "components/Instances";

const mapStateToProps = (state) => {
    return {
        id: state.transitionProperties.id,
        jsonMessageString: state.transitionProperties.jsonMessageString,
        messageType: state.transitionProperties.messageType,
        active: state.transitionProperties.active,
        stateMachine: state.transitionProperties.stateMachine,
        currentComponent: state.components.currentComponent,
        getStateMachineRefFromId: (id) => {
            if (!id) {
                return null;
            }
            let componentProperties = state.components.componentProperties;
            let currentComponent = state.components.currentComponent;
            let stateMachine = state.transitionProperties.stateMachine;
            let instance = componentProperties[currentComponent].stateMachineProperties[stateMachine][id];
            if (instance.isFinal) {
                return null;
            }
            return instance.stateMachineRef;
        }
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentId: (id) => {
            dispatch(setCurrentId(id));
        },
        setJsonMessageString: (jsonMessageString) => {
            dispatch(setJsonMessageString(jsonMessageString));
        },
        hideTransitionProperties: () => {
            dispatch(hideTransitionProperties());
        },
        send: (component, stateMachine, messageType, jsonMessageString) => {
            sessionXCSpy.getPromiseCreateSession()
                .then((session) => {
                    let publisher = session.createPublisher();
                    let jsonMessage;
                    try {
                        jsonMessage = JSON.parse(jsonMessageString);
                        publisher.send(component, stateMachine, messageType, jsonMessage);
                    } catch (e) {
                        alert("Json format incorrect");
                        console.error(e);
                    }
                });
        },
        sendContext: (stateMachineRef, messageType, jsonMessageString) => {
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
        }
    };
};

const TransitionProperties = ({
    messageType,
    active,
    hideTransitionProperties,
    stateMachine,
    currentComponent,
    send,
    sendContext,
    jsonMessageString,
    setJsonMessageString,
    id,
    setCurrentId,
    getStateMachineRefFromId
}) => {
    if (!active)
        return null;
    return <Layer onClose={hideTransitionProperties} closer={true} align="right">
        <Form compact={false}>
            <Header>
                <Title>Send event form </Title>
            </Header>
            <FormField>
                <fieldset>
                    <label htmlFor="componentName">Component: {currentComponent}</label>
                </fieldset>
            </FormField>

            <FormField>
                <fieldset>
                    <label htmlFor="stateMachineTarget">State machine: {stateMachine}</label>
                </fieldset>
            </FormField>

            <FormField>
                <fieldset>
                    <label htmlFor="messageType">Message type: {messageType}</label>
                </fieldset>
            </FormField>

            <FormField>
                <fieldset>
                    <label htmlFor="instances">Instance identifier:
                        <Instances onChange={setCurrentId} stateMachine={stateMachine}/>
                    </label>
                </fieldset>
            </FormField>


            <FormField >
                <fieldset>
                    <label htmlFor="jsonEvent" >Json Event:
                        <textarea defaultValue={jsonMessageString} onChange={(e) => {
                            setJsonMessageString(e.currentTarget.value);
                        }}></textarea>
                    </label>
                </fieldset>
            </FormField>

            <Footer>
                <Button primary={true} type="button" label="Send" onClick={() => {
                    send(currentComponent, stateMachine, messageType, jsonMessageString);
                }} />
                <Button primary={true} type="button" label="Send context" onClick={() => {
                    sendContext(getStateMachineRefFromId(id), messageType, jsonMessageString);
                }} />
            </Footer>
        </Form >
    </Layer>;
    ;
};

export default connect(mapStateToProps, mapDispatchToProps)(TransitionProperties);