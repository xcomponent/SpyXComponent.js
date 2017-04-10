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
import { updateGraphic, setStateMachineId, hideTransitionProperties, setJsonMessageString, setCurrentId, setPrivateTopic, send, sendContext } from "actions";
import * as Select from "grommet/components/Select";
import * as Box from "grommet/components/Box";
import * as CheckBox from "grommet/components/CheckBox";
import * as TextInput from "grommet/components/TextInput";
import Instances from "components/Instances";
import { XCSpyState } from "reducers/SpyReducer";
import { Dispatch } from "redux";
import { Instance } from "reducers/components";

interface TransitionPropertiesGlobalProps extends TransitionPropertiesProps, TransitionPropertiesCallbackProps {
};

interface TransitionPropertiesProps {
    privateTopic: string;
    id: string;
    jsonMessageString: string;
    messageType: string;
    active: boolean;
    stateMachine: string;
    currentComponent: string;
    stateMachineRef: any;
    instances: { [id: number]: Instance };
};

interface TransitionPropertiesCallbackProps {
    setPrivateTopic: (privateSend: string) => void;
    setCurrentId: (id: string) => void;
    setJsonMessageString: (jsonMessageString: string) => void;
    hideTransitionProperties: () => void;
    send: (component: string, stateMachine: string, messageType: string, jsonMessageString: string) => void;
    sendContext: (stateMachineRef: any, messageType: string, jsonMessageString: string) => void;
};


const mapStateToProps = (state: XCSpyState): TransitionPropertiesProps => {
    const active = state.transitionProperties.active;
    const id = state.transitionProperties.id;
    const componentProperties = state.components.componentProperties;
    const currentComponent = state.components.currentComponent;
    const stateMachine = state.transitionProperties.stateMachine;
    const instances = (!active) ? null : componentProperties[currentComponent].stateMachineProperties[stateMachine];
    const privateTopic = state.transitionProperties.privateTopic;
    const jsonMessageString = state.transitionProperties.jsonMessageString;
    const messageType = state.transitionProperties.messageType;
    const stateMachineRef = (() => {
        if (!id)
            return null;
        const instance = componentProperties[currentComponent].stateMachineProperties[stateMachine][id];
        if (instance.isFinal)
            return null;
        return instance.stateMachineRef;
    })();
    return {
        instances,
        privateTopic,
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
        send: (component: string, stateMachine: string, messageType: string, jsonMessageString: string): void => {
            dispatch(send(component, stateMachine, messageType, jsonMessageString));
        },
        sendContext: (stateMachineRef: any, messageType: string, jsonMessageString: string): void => {
            dispatch(sendContext(stateMachineRef, messageType, jsonMessageString));
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
    setPrivateTopic,
    send,
    sendContext,
    instances
}: TransitionPropertiesGlobalProps) => {
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
                                    suggestions={sessionXCSpy.getPrivateTopics()}
                                    onSelect={(e) => {
                                        e.target.value = e.suggestion;
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
                    send(currentComponent, stateMachine, messageType, jsonMessageString);
                }} />
                <Button primary={true} type="button" label="Send context" onClick={() => {
                    sendContext(stateMachineRef, messageType, jsonMessageString);
                }} />
            </Footer>
        </Form >
    </Layer>;
    ;
};

export default connect(mapStateToProps, mapDispatchToProps)(TransitionProperties);