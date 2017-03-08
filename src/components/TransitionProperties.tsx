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
import { hideTransitionProperties } from "actions/transitionProperties";

const mapStateToProps = (state) => {
    return {
        messageType: state.transitionProperties.messageType,
        active: state.transitionProperties.active,
        stateMachine: state.transitionProperties.stateMachine,
        currentComponent: state.components.currentComponent,
        getInstances: () => {
            let componentProperties = state.components.componentProperties;
            let currentComponent = state.components.currentComponent;
            let stateMachine = state.transitionProperties.stateMachine;
            return Object.keys(componentProperties[currentComponent].stateMachineProperties[stateMachine]);
        }
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
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
                    } catch (e) {
                        alert("Json format incorrect");
                        console.error(e);
                    }
                    publisher.send(component, stateMachine, messageType, jsonMessage);
                });
        }
    };
};

const TransitionProperties = ({
    messageType,
    active,
    hideTransitionProperties,
    stateMachine,
    currentComponent,
    getInstances,
    send
}) => {
    if (!active)
        return null;
    let jsonMessageString = "{}";
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
                        <select onChange={(e) => {
                        }}>
                            {getInstances().map((id) => {
                                return (
                                    <option key={id} value={id}>{id}</option>
                                );
                            })}
                        </select>

                    </label>
                </fieldset>
            </FormField>

            <FormField >
                <fieldset>
                    <label htmlFor="jsonEvent">Json Event:
                        <textarea onChange={(e) => {
                            jsonMessageString = e.currentTarget.value;
                        }}>{jsonMessageString}</textarea>
                    </label>
                </fieldset>
            </FormField>

            <Footer>
                <Button primary={true} type="button" label="Send" onClick={() => {
                    send(currentComponent, stateMachine, messageType, jsonMessageString);
                }} />
                <Button primary={true} type="button" label="Send context" onClick={() => {
                }} />
            </Footer>
        </Form >
    </Layer>;
    ;
};

export default connect(mapStateToProps, mapDispatchToProps)(TransitionProperties);