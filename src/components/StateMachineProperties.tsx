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
import { routes } from "utils/routes";
import { xcMessages } from "reactivexcomponent.js/lib/types";
import { injectIntl, InjectedIntl } from "react-intl";
import * as CloseIcon from "grommet/components/icons/base/Close";

interface StateMachinePropertiesGlobalProps extends StateMachinePropertiesProps, StateMachinePropertiesCallbackProps {
};

interface StateMachinePropertiesProps {
    intl?: InjectedIntl;
    active: boolean;
    stateMachine: string;
    id: string;
    currentComponent: string;
    ids: string[];
    instances: { [id: number]: Instance };
    publicMember: string;
    stateMachineRef: xcMessages.StateMachineRef;
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
    const currentComponent = urlSearchParams.get(routes.params.currentComponent);
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
                align="right"
                onClose={this.props.hideStateMachineProperties}>
                <Form compact={false}>
                    <Box direction="row" align="center" justify="center">
                        <Box align="start" justify="center" size="large" basis="1/2">
                            <Title>
                                {this.props.stateMachine}
                            </Title>
                        </Box>
                        <Box align="end" justify="center" size="large" basis="1/2">
                            <Button title={"Close"} icon={<CloseIcon size="medium" />}
                                onClick={this.props.hideStateMachineProperties} />
                        </Box>
                    </Box>

                    <FormField>
                        <fieldset>
                            <label htmlFor="instances">{this.props.intl.formatMessage({ id: "app.instance.identifier" })} :
                            <Instances onChange={this.props.setStateMachineId} stateMachine={this.props.stateMachine} instances={this.props.instances} />
                            </label>
                        </fieldset>
                    </FormField>

                    <FormField>
                        <fieldset>
                            <label htmlFor="publicMember">{this.props.intl.formatMessage({ id: "app.public.member" })} : <br />
                                {this.props.publicMember}
                            </label>
                        </fieldset>
                    </FormField>

                    <FormField>
                        <fieldset>
                            <label htmlFor="currentState">{this.props.intl.formatMessage({ id: "app.current.state" })} : {" "}
                                {(this.props.stateMachineRef) ? this.props.stateMachineRef.StateName : null}
                            </label>
                        </fieldset>
                    </FormField>

                    <FormField>
                        <fieldset>
                            <label htmlFor="agentId">{this.props.intl.formatMessage({ id: "app.agent.id" })} : {" "}
                                {(this.props.stateMachineRef) ? this.props.stateMachineRef.AgentId : null}
                            </label>
                        </fieldset>
                    </FormField>


                    <Footer></Footer>
                    <Button primary={true} type="button" label={this.props.intl.formatMessage({ id: "app.snapshot" })} onClick={() => {
                        this.props.snapshot(this.props.currentComponent, this.props.stateMachine);
                        this.props.hideStateMachineProperties();
                    }} />
                    <Button primary={true} type="button" label={this.props.intl.formatMessage({ id: "app.clear" })} onClick={() => {
                        this.props.clearFinalStates(this.props.currentComponent, this.props.stateMachine);
                        this.props.hideStateMachineProperties();
                    }} />
                </Form >
            </Layer>
        );
    }
}

export default withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(StateMachineProperties)));