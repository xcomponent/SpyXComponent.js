import "grommet/grommet-hpinc.min.css";
import * as React from "react";
import { connect } from "react-redux";
import { setCompositionModel, getApiList, selectApi, formSubmit, showStateMachineProperties, showTransitionProperties, initialization, updateGraphic, clearFinalStates, subscribeAllStateMachinesAction, snapshotEntryPointAction } from "actions";
import { Parser } from "../utils/parser";
import { DrawComponent } from "../utils/drawComponent";
import * as Anchor from "grommet/components/Anchor";
import * as Menu from "grommet/components/Menu";
import * as go from "gojs";
import * as Title from "grommet/components/Title";
import * as Button from "grommet/components/Button";
import { backgroundColor } from "utils/graphicColors";
import { Dispatch } from "redux";
import { XCSpyState } from "reducers/SpyReducer";
import { ComponentProperties } from "reducers/components";
import * as Box from "grommet/components/Box";
import { withRouter } from "react-router-dom";
import {API, CURRENT_COMPONENT, SERVER_URL } from "utils/urlParams";

interface ComponentsGlobalProps extends ComponentsProps, ComponentsCallbackProps {
    history: any;
};

interface ComponentsProps {
    currentComponent: string;
    diagram: go.Diagram;
    compositionModel: any;
};

interface ComponentsCallbackProps {
    initialization: (componentProperties: { [componentName: string]: ComponentProperties }, currentComponent: string, projectName: string) => void;
    showStateMachineProperties: (component: string, stateMachine: string) => void;
    updateGraphic: (component: string, stateMachine: string, data: any) => void;
    showTransitionProperties: (component: string, stateMachine: string, messageType: string, jsonMessageString: string) => void;
    clearFinalStates: (component: string, stateMachines: string[]) => void;
    subscribeAllStateMachines: (component: string, stateMachines: string[]) => void;
    snapshotEntryPoint: (component: string, entryPoint: string) => void;
};

const mapStateToProps = (state: XCSpyState, ownProps): ComponentsProps => {
    const urlSearchParams = new URLSearchParams(ownProps.location.search);
    const currentComponent = urlSearchParams.get(CURRENT_COMPONENT);
    const componentProperties = state.components.componentProperties;
    const diagram = (!state.components.initialized) ? null : componentProperties[currentComponent].diagram;
    return {
        currentComponent,
        diagram,
        compositionModel: state.compositionModel.value
    };
};

const mapDispatchToProps = (dispatch: Dispatch<XCSpyState>): ComponentsCallbackProps => {
    return {
        initialization: (componentProperties: { [componentName: string]: ComponentProperties }, currentComponent: string, projectName: string): void => {
            dispatch(initialization(componentProperties, currentComponent, projectName));
        },
        showStateMachineProperties: (component: string, stateMachine: string): void => {
            dispatch(showStateMachineProperties(component, stateMachine));
        },
        updateGraphic: (component: string, stateMachine: string, data: any): void => {
            dispatch(updateGraphic(component, stateMachine, data));
        },
        showTransitionProperties: (component: string, stateMachine: string, messageType: string, jsonMessageString: string): void => {
            dispatch(showTransitionProperties(component, stateMachine, messageType, jsonMessageString));
        },
        clearFinalStates: (component: string, stateMachines: string[]): void => {
            for (let i = 0; i < stateMachines.length; i++) {
                dispatch(clearFinalStates(component, stateMachines[i]));
            }
        },
        subscribeAllStateMachines: (component: string, stateMachines: string[]): void => {
            dispatch(subscribeAllStateMachinesAction(component, stateMachines));
        },
        snapshotEntryPoint: (component: string, entryPoint: string): void => {
            dispatch(snapshotEntryPointAction(component, entryPoint));
        }
    };
};

class Components extends React.Component<ComponentsGlobalProps, XCSpyState> {
    constructor(props: ComponentsGlobalProps) {
        super(props);
        this.getContainersForGraphs = this.getContainersForGraphs.bind(this);
        this.addDiagramEventClick = this.addDiagramEventClick.bind(this);
    }

    addDiagramEventClick(diagram: go.Diagram): void {
        const props = this.props;
        diagram.addDiagramListener("ObjectDoubleClicked", ((diagramEvent: go.DiagramEvent) => {
            const data = diagramEvent.subject.part.data;
            if (data.isGroup) { // it is a stateMachine
                props.showStateMachineProperties(this.props.currentComponent, data.key);
            } else if (data.stateMachineTarget) { // it is a transition
                props.showTransitionProperties(this.props.currentComponent, data.stateMachineTarget, data.messageType, "{}");
            }
        }).bind(this));
    }

    componentDidMount() {
        const props = this.props;
        const componentProperties = {};
        const components = props.compositionModel.components;
        components.forEach((component) => {
            const parser = new Parser(component);
            parser.parse();
            props.subscribeAllStateMachines(parser.getComponentName(), parser.getStateMachineNames());
            props.snapshotEntryPoint(parser.getComponentName(), parser.getEntryPointStateMachine());
            const drawComponent = new DrawComponent();
            drawComponent.draw(parser, parser.getComponentName());
            const stateMachineProperties = {};
            for (let k = 0; k < parser.getStateMachineNames().length; k++) {
                stateMachineProperties[parser.getStateMachineNames()[k]] = {};
            }
            componentProperties[parser.getComponentName()] = {
                diagram: drawComponent.diagram,
                stateMachineProperties,
                finalStates: parser.getFinalStates(),
                entryPointState: parser.getEntryPointState()
            };
            this.addDiagramEventClick(drawComponent.diagram);
        });
        props.initialization(componentProperties, components[0].name, props.compositionModel.projectName);
    }

    getContainersForGraphs(diagram: go.Diagram) {
        const props = this.props;
        const divs = [];
        let visibility;
        props.compositionModel.components.map((component) => {
            visibility = (component.name === props.currentComponent) ? "block" : "none";
            divs.push(
                <div
                    key={component.name}
                    id={component.name}
                    style={{
                        "height": "100%",
                        "width": "100%",
                        "display": visibility,
                        "backgroundColor": backgroundColor
                    }}></div>
            );
            if (diagram) {
                diagram.requestUpdate();
            }
        });
        return divs;
    }

    render() {
        return (
            <Box full={true}>
                {this.getContainersForGraphs(this.props.diagram)}
            </Box>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Components));