import "grommet/grommet-hpinc.min.css";
import * as React from "react";
import { connect } from "react-redux";
import { setCompositionModel, getApiList, selectApi, formSubmit, showStateMachineProperties, showTransitionProperties, initialization, updateGraphic, clearFinalStates } from "actions";
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
import { subscribeAllStateMachines } from "core";
import * as Box from "grommet/components/Box";

interface ComponentsGlobalProps extends ComponentsProps, ComponentsCallbackProps {
    compositionModel: any;
    parsers: Parser[];
};

interface ComponentsProps {
    getAutoClear: () => boolean;
    currentComponent: string;
    getDiagram: () => go.Diagram;
};

interface ComponentsCallbackProps {
    initialization: (componentProperties: { [componentName: string]: ComponentProperties }, currentComponent: string, projectName: string) => void;
    showStateMachineProperties: (stateMachine: string) => void;
    updateGraphic: (component: string, stateMachine: string, data: any) => void;
    showTransitionProperties: (stateMachine: string, messageType: string, jsonMessageString: string) => void;
    clearFinalStates: (component: string, stateMachines: string[]) => void;
};

const mapStateToProps = (state: XCSpyState): ComponentsProps => {
    return {
        getAutoClear: (): boolean => {
            return state.components.autoClear;
        },
        currentComponent: state.components.currentComponent,
        getDiagram: (): go.Diagram => {
            const initialized = state.components.initialized;
            if (!initialized) {
                return null;
            } else {
                const currentComponent = state.components.currentComponent;
                const componentProperties = state.components.componentProperties;
                return componentProperties[currentComponent].diagram;
            }
        }
    };
};

const mapDispatchToProps = (dispatch: Dispatch<XCSpyState>): ComponentsCallbackProps => {
    return {
        initialization: (componentProperties: { [componentName: string]: ComponentProperties }, currentComponent: string, projectName: string): void => {
            dispatch(initialization(componentProperties, currentComponent, projectName));
        },
        showStateMachineProperties: (stateMachine: string): void => {
            dispatch(showStateMachineProperties(stateMachine));
        },
        updateGraphic: (component: string, stateMachine: string, data: any): void => {
            dispatch(updateGraphic(component, stateMachine, data));
        },
        showTransitionProperties: (stateMachine: string, messageType: string, jsonMessageString: string): void => {
            dispatch(showTransitionProperties(stateMachine, messageType, jsonMessageString));
        },
        clearFinalStates: (component: string, stateMachines: string[]): void => {
            for (let i = 0; i < stateMachines.length; i++) {
                dispatch(clearFinalStates(component, stateMachines[i]));
            }
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
                props.showStateMachineProperties(data.key);
            } else if (data.stateMachineTarget) { // it is a transition
                props.showTransitionProperties(data.stateMachineTarget, data.messageType, "{}");
            }
        }).bind(this));
    }

    componentDidMount() {
        const props = this.props;
        // const comps = props.compositionModel.components;
        const parsers = props.parsers;
        const componentProperties = {};
        for (let i = 0; i < parsers.length; i++) {
            const parser = parsers[i];
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
        }
        props.initialization(componentProperties, parsers[0].getComponentName(), props.compositionModel.projectName);
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
                {this.getContainersForGraphs(this.props.getDiagram())}
            </Box>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Components);