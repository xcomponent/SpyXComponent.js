import * as React from "react";
import { connect } from "react-redux";
import * as Layer from "grommet/components/Layer";
import { hideStateMachineProperties, updateGraphic, clearFinalStates, setStateMachineId } from "actions";
import * as Header from "grommet/components/Header";
import * as Title from "grommet/components/Title";
import * as Form from "grommet/components/Form";
import * as FormField from "grommet/components/FormField";
import * as Button from "grommet/components/Button";
import * as Footer from "grommet/components/Footer";
import sessionXCSpy from "utils/sessionXCSpy";
import * as Select from "grommet/components/Select";
import * as Box from "grommet/components/Box";
import Instances from "components/Instances";
import { XCSpyState } from "reducers/SpyReducer";
import { Dispatch } from "redux";

interface StateMachinePropertiesGlobalProps extends StateMachinePropertiesProps, StateMachinePropertiesCallbackProps {
};

interface StateMachinePropertiesProps {
    active: boolean;
    stateMachine: string;
    id: string;
    currentComponent: string;
    getIds: () => string[];
    getPublicMember: () => string;
    getStateMachineRef: () => any;
    getFirstId: (stateMachine: string) => string;
};

interface StateMachinePropertiesCallbackProps {
    clearFinalStates: (component: string, stateMachine: string) => void;
    setStateMachineId: (id: string) => void;
    hideStateMachineProperties: () => void;
    updateGraphic: (currentComponent: string, stateMachine: string) => void;
};

const mapStateToProps = (state: XCSpyState): StateMachinePropertiesProps => {
    return {
        active: state.stateMachineProperties.active,
        stateMachine: state.stateMachineProperties.stateMachine,
        id: state.stateMachineProperties.id,
        currentComponent: state.components.currentComponent,
        getIds: (): string[] => {
            const componentProperties = state.components.componentProperties;
            const currentComponent = state.components.currentComponent;
            const stateMachine = state.stateMachineProperties.stateMachine;
            return Object.keys(componentProperties[currentComponent].stateMachineProperties[stateMachine]);
        },
        getPublicMember: (): string => {
            const id = state.stateMachineProperties.id;
            if (!id)
                return null;
            const componentProperties = state.components.componentProperties;
            const currentComponent = state.components.currentComponent;
            const stateMachine = state.stateMachineProperties.stateMachine;
            const publicMember = componentProperties[currentComponent].stateMachineProperties[stateMachine][id].jsonMessage;
            return JSON.stringify(publicMember);
        },
        getStateMachineRef: (): any => {
            const id = state.stateMachineProperties.id;
            if (!id)
                return null;
            const componentProperties = state.components.componentProperties;
            const currentComponent = state.components.currentComponent;
            const stateMachine = state.stateMachineProperties.stateMachine;
            return componentProperties[currentComponent].stateMachineProperties[stateMachine][id].stateMachineRef;
        },
        getFirstId: (stateMachine): string => {
            const componentProperties = state.components.componentProperties;
            const currentComponent = state.components.currentComponent;
            return Object.keys(componentProperties[currentComponent].stateMachineProperties[stateMachine])[0];
        }

    };
};

const mapDispatchToProps = (dispatch: Dispatch<void>): StateMachinePropertiesCallbackProps => {
    return {
        clearFinalStates: (component: string, stateMachine: string): void => {
            dispatch(clearFinalStates(component, stateMachine));
        },
        setStateMachineId: (id: string): void => {
            dispatch(setStateMachineId(id));
        },
        hideStateMachineProperties: (): void => {
            dispatch(hideStateMachineProperties());
        },
        updateGraphic: (currentComponent: string, stateMachine: string): void => {
            sessionXCSpy.getPromiseCreateSession()
                .then((session) => {
                    session.createSubscriber().getSnapshot(currentComponent, stateMachine, (items) => {
                        for (let i = 0; i < items.length; i++) {
                            dispatch(updateGraphic(currentComponent, stateMachine, items[i]));
                        }
                        console.log(items);
                    });
                });
        }
    };
};

const StateMachineProperties = ({
    updateGraphic,
    hideStateMachineProperties,
    active,
    stateMachine,
    currentComponent,
    getIds,
    setStateMachineId,
    id,
    getPublicMember,
    getStateMachineRef,
    clearFinalStates,
    getFirstId
}: StateMachinePropertiesGlobalProps) => {
    if (!active)
        return null;
    if (!id && getIds().length > 0) {
        setStateMachineId(getIds()[0]);
    }
    return (
        <Layer
            closer={true}
            align="right"
            onClose={hideStateMachineProperties}>
            <Form compact={false}>
                <Header>
                    <Box align="center">
                        <Title>{stateMachine}</Title>
                    </Box>
                </Header>

                <FormField>
                    <fieldset>
                        <label htmlFor="instances">Instance identifier:
                            <Instances onChange={setStateMachineId} stateMachine={stateMachine} />
                        </label>
                    </fieldset>
                </FormField>

                <FormField>
                    <fieldset>
                        <label htmlFor="publicMember">Public member : <br />
                            {getPublicMember()}
                        </label>
                    </fieldset>
                </FormField>

                <FormField>
                    <fieldset>
                        <label htmlFor="currentState">Current state : {" "}
                            {(getStateMachineRef()) ? getStateMachineRef().StateName : null}
                        </label>
                    </fieldset>
                </FormField>

                <FormField>
                    <fieldset>
                        <label htmlFor="agentId">Agent Id : {" "}
                            {(getStateMachineRef()) ? getStateMachineRef().AgentId : null}
                        </label>
                    </fieldset>
                </FormField>


                <Footer></Footer>
                <Button primary={true} type="button" label="Snapshot" onClick={() => {
                    updateGraphic(currentComponent, stateMachine);
                }} />
                <Button primary={true} type="button" label="Clear" onClick={() => {
                    clearFinalStates(currentComponent, stateMachine);
                    setStateMachineId(getFirstId(stateMachine));
                }} />
            </Form >
        </Layer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(StateMachineProperties);