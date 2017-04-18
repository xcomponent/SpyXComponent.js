import * as React from "react";
import { connect } from "react-redux";
import * as Layer from "grommet/components/Layer";
import { hideStateMachineProperties, updateGraphic, clearFinalStates, setStateMachineId, snapshotAction } from "actions";
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
import { snapshot } from "core";
import { Instance } from "reducers/components";
import { withRouter } from "react-router-dom";
import { CURRENT_COMPONENT } from "utils/urlParams";

interface StateMachinePropertiesGlobalProps extends StateMachinePropertiesProps, StateMachinePropertiesCallbackProps {
};

interface StateMachinePropertiesProps {
    active: boolean;
    stateMachine: string;
    id: string;
    currentComponent: string;
    ids: string[];
    instances: { [id: number]: Instance };
    publicMember: string;
    stateMachineRef: any;
};

interface StateMachinePropertiesCallbackProps {
    clearFinalStates: (component: string, stateMachine: string) => void;
    setStateMachineId: (id: string) => void;
    hideStateMachineProperties: () => void;
    snapshot: (currentComponent: string, stateMachine: string) => void;
};

const mapStateToProps = (state: XCSpyState, ownProps): StateMachinePropertiesProps => {
    const urlSearchParams = new URLSearchParams(ownProps.location.search);
    const id = state.stateMachineProperties.id;
    const active = state.stateMachineProperties.active;
    const componentProperties = state.components.componentProperties;
    const currentComponent = urlSearchParams.get(CURRENT_COMPONENT);
    const stateMachine = state.stateMachineProperties.stateMachine;
    const instances = (!active) ? null : componentProperties[currentComponent].stateMachineProperties[stateMachine];
    const ids = (instances !== null) ? Object.keys(instances) : null;
    const stateMachineRef = (!id) ? null : componentProperties[currentComponent].stateMachineProperties[stateMachine][id].stateMachineRef;
    const publicMember = (!id) ? null : JSON.stringify(instances[id].jsonMessage);
    return {
        active,
        stateMachine,
        id,
        currentComponent,
        ids: ids,
        instances,
        publicMember,
        stateMachineRef
    };
};

const mapDispatchToProps = (dispatch: Dispatch<XCSpyState>): StateMachinePropertiesCallbackProps => {
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
        snapshot: (currentComponent: string, stateMachine: string): void => {
            dispatch(snapshotAction(currentComponent, stateMachine));
        }
    };
};


class StateMachineProperties extends React.Component<StateMachinePropertiesGlobalProps, XCSpyState> {
    constructor(props: StateMachinePropertiesGlobalProps) {
        super(props);
    }

    componentWillMount() {
        if (this.props.active && !this.props.id && this.props.ids.length > 0) {
            setStateMachineId(this.props.ids[0]);
        }
    }

    render() {
        if (!this.props.active)
            return null;
        return (
            <Layer
                closer={true}
                align="right"
                onClose={this.props.hideStateMachineProperties}>
                <Form compact={false}>
                    <Header>
                        <Box align="center">
                            <Title>{this.props.stateMachine}</Title>
                        </Box>
                    </Header>

                    <FormField>
                        <fieldset>
                            <label htmlFor="instances">Instance identifier:
                            <Instances onChange={this.props.setStateMachineId} stateMachine={this.props.stateMachine} instances={this.props.instances} />
                            </label>
                        </fieldset>
                    </FormField>

                    <FormField>
                        <fieldset>
                            <label htmlFor="publicMember">Public member : <br />
                                {this.props.publicMember}
                            </label>
                        </fieldset>
                    </FormField>

                    <FormField>
                        <fieldset>
                            <label htmlFor="currentState">Current state : {" "}
                                {(this.props.stateMachineRef) ? this.props.stateMachineRef.StateName : null}
                            </label>
                        </fieldset>
                    </FormField>

                    <FormField>
                        <fieldset>
                            <label htmlFor="agentId">Agent Id : {" "}
                                {(this.props.stateMachineRef) ? this.props.stateMachineRef.AgentId : null}
                            </label>
                        </fieldset>
                    </FormField>


                    <Footer></Footer>
                    <Button primary={true} type="button" label="Snapshot" onClick={() => {
                        this.props.snapshot(this.props.currentComponent, this.props.stateMachine);
                    }} />
                    <Button primary={true} type="button" label="Clear" onClick={() => {
                        this.props.clearFinalStates(this.props.currentComponent, this.props.stateMachine);
                        this.props.hideStateMachineProperties();
                    }} />
                </Form >
            </Layer>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StateMachineProperties));