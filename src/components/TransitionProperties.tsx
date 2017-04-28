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
import { SessionXCSpy } from "utils/sessionXCSpy";
import { updateGraphic, setStateMachineId, hideTransitionProperties, setJsonMessageString, setCurrentId, setPrivateTopic, send, sendContext } from "actions";
import * as Select from "grommet/components/Select";
import * as Box from "grommet/components/Box";
import * as CheckBox from "grommet/components/CheckBox";
import * as TextInput from "grommet/components/TextInput";
import Instances from "components/Instances";
import { XCSpyState } from "reducers/SpyReducer";
import { Dispatch } from "redux";
import { Instance } from "reducers/components";
import { withRouter } from "react-router-dom";
import { routes } from "utils/routes";
import { xcMessages } from "reactivexcomponent.js/lib/types";
import * as HomeIcon from "grommet/components/icons/base/home";
import * as CloseIcon from "grommet/components/icons/base/Close";

interface TransitionPropertiesGlobalProps extends TransitionPropertiesProps, TransitionPropertiesCallbackProps {
};

interface TransitionPropertiesProps {
    privateTopics: string[];
    privateTopic: string;
    id: string;
    jsonMessageString: string;
    messageType: string;
    active: boolean;
    stateMachine: string;
    currentComponent: string;
    stateMachineRef: xcMessages.StateMachineRef;
    instances: { [id: number]: Instance };
};

interface TransitionPropertiesCallbackProps {
    setPrivateTopic: (privateSend: string) => void;
    setCurrentId: (id: string) => void;
    setJsonMessageString: (jsonMessageString: string) => void;
    hideTransitionProperties: () => void;
    send: (component: string, stateMachine: string, messageType: string, jsonMessageString: string, privateTopic: string) => void;
    sendContext: (stateMachineRef: xcMessages.StateMachineRef, messageType: string, jsonMessageString: string, privateTopic: string) => void;
};


const mapStateToProps = (state: XCSpyState, ownProps): TransitionPropertiesProps => {
    const urlSearchParams = new URLSearchParams(ownProps.location.search);
    const active = state.transitionProperties.active;
    const id = state.transitionProperties.id;
    const componentProperties = state.components.componentProperties;
    const currentComponent = urlSearchParams.get(routes.params.currentComponent);
    const stateMachine = state.transitionProperties.stateMachine;
    const instances = (!active) ? null : componentProperties[currentComponent].stateMachineProperties[stateMachine];
    const privateTopic = state.transitionProperties.defaultPrivateTopic;
    const privateTopics = state.transitionProperties.privateTopics;
    const jsonMessageString = state.transitionProperties.jsonMessageString;
    const messageType = state.transitionProperties.messageType;
    const stateMachineRef = (!id || !active || componentProperties[currentComponent].stateMachineProperties[stateMachine][id].isFinal) ? null : componentProperties[currentComponent].stateMachineProperties[stateMachine][id].stateMachineRef;
    return {
        instances,
        privateTopic,
        privateTopics,
        id,
        jsonMessageString,
        messageType,
        active,
        stateMachine,
        currentComponent,
        stateMachineRef
    };
};

const mapDispatchToProps = (dispatch: Dispatch<XCSpyState>): TransitionPropertiesCallbackProps => {
    return {
        setPrivateTopic: (privateSend: string): void => {
            dispatch(setPrivateTopic(privateSend));
        },
        setCurrentId: (id: string): void => {
            dispatch(setCurrentId(id));
        },
        setJsonMessageString: (jsonMessageString: string): void => {
            dispatch(setJsonMessageString(jsonMessageString));
        },
        hideTransitionProperties: (): void => {
            dispatch(hideTransitionProperties());
        },
        send: (component: string, stateMachine: string, messageType: string, jsonMessageString: string, privateTopic: string): void => {
            dispatch(send(component, stateMachine, messageType, jsonMessageString, privateTopic));
        },
        sendContext: (stateMachineRef: xcMessages.StateMachineRef, messageType: string, jsonMessageString: string, privateTopic: string): void => {
            dispatch(sendContext(stateMachineRef, messageType, jsonMessageString, privateTopic));
        }
    };
};

const TransitionProperties = ({
    messageType,
    active,
    hideTransitionProperties,
    stateMachine,
    currentComponent,
    jsonMessageString,
    setJsonMessageString,
    id,
    setCurrentId,
    stateMachineRef,
    privateTopic,
    privateTopics,
    setPrivateTopic,
    send,
    sendContext,
    instances
}: TransitionPropertiesGlobalProps) => {
    if (!active)
        return null;
    return <Layer onClose={hideTransitionProperties} align="right">
        <Form compact={false}>
            <Box direction="row" align="center" justify="center">
                <Box align="start" justify="center" size="large" basis="1/2">
                    <Title>
                        Send Event
                    </Title>
                </Box>
                <Box align="end" justify="center" size="large" basis="1/2">
                    <Button title={"Close"} icon={<CloseIcon size="medium" />}
                        onClick={hideTransitionProperties} />
                </Box>
            </Box>
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
                        <Instances onChange={setCurrentId} stateMachine={stateMachine} instances={instances} />
                    </label>
                </fieldset>
            </FormField>

            <FormField>
                <fieldset>
                    <label htmlFor="instances">
                        <Box size={"medium"} direction={"row"}>
                            <Box pad={{ horizontal: "none", vertical: "small", between: "small" }}>
                                Topic:
                            </Box>
                            <Box size={"medium"}>
                                <TextInput
                                    value={privateTopic}
                                    suggestions={privateTopics}
                                    onSelect={(e) => {
                                        setPrivateTopic(e.suggestion);
                                    }}
                                    onDOMChange={(e) => {
                                        setPrivateTopic(e.target.value);
                                    }}
                                />
                            </Box>
                        </Box>
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
                    send(currentComponent, stateMachine, messageType, jsonMessageString, privateTopic);
                }} />
                <Button primary={true} type="button" label="Send context" onClick={() => {
                    sendContext(stateMachineRef, messageType, jsonMessageString, privateTopic);
                }} />
            </Footer>
        </Form >
    </Layer>;
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TransitionProperties));