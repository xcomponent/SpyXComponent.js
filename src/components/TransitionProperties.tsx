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
import { updateGraphic, setStateMachineId, hideTransitionProperties, setJsonMessageString, setCurrentId, setPrivateTopic } from "actions";
import * as Select from "grommet/components/Select";
import * as Box from "grommet/components/Box";
import * as CheckBox from "grommet/components/CheckBox";
import * as TextInput from "grommet/components/TextInput";
import Instances from "components/Instances";
import { XCSpyState } from "reducers/SpyReducer";
import { Dispatch } from "redux";

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
    getStateMachineRefFromId: (id: string) => any;
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
    return {
        privateTopic: state.transitionProperties.privateTopic,
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
            const componentProperties = state.components.componentProperties;
            const currentComponent = state.components.currentComponent;
            const stateMachine = state.transitionProperties.stateMachine;
            const instance = componentProperties[currentComponent].stateMachineProperties[stateMachine][id];
            if (instance.isFinal) {
                return null;
            }
            return instance.stateMachineRef;
        }
    };
};

const mapDispatchToProps = (dispatch: Dispatch<void>): TransitionPropertiesCallbackProps => {
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
        },
        sendContext: (stateMachineRef: any, messageType: string, jsonMessageString: string): void => {
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
    getStateMachineRefFromId,
    privateTopic,
    setPrivateTopic
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
                        <Instances onChange={setCurrentId} stateMachine={stateMachine} />
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
                    sendContext(getStateMachineRefFromId(id), messageType, jsonMessageString);
                }} />
            </Footer>
        </Form >
    </Layer>;
    ;
};

export default connect(mapStateToProps, mapDispatchToProps)(TransitionProperties);