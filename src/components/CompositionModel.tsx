import "grommet/grommet-hpinc.min.css";
import * as React from "react";
import { connect } from "react-redux";
import { setCompositionModel, getApiList, selectApi, formSubmit, showStateMachineProperties, showTransitionProperties, initialization, updateGraphic, clearFinalStates } from "actions";
import { Parser } from "../utils/parser";
import { DrawComponent } from "../utils/drawComponent";
import SideBar from "components/SideBar";
import * as Split from "grommet/components/Split";
import * as Box from "grommet/components/Box";
import Footer from "components/Footer";
import * as Anchor from "grommet/components/Anchor";
import * as Menu from "grommet/components/Menu";
import StateMachineProperties from "components/StateMachineProperties";
import AppHeader from "components/AppHeader";
import sessionXCSpy from "utils/sessionXCSpy";
import * as go from "gojs";
import TransitionProperties from "components/TransitionProperties";
import * as Title from "grommet/components/Title";
import * as Button from "grommet/components/Button";
import { backgroundColor } from "utils/graphicColors";
import { Dispatch } from "redux";
import { XCSpyState } from "reducers/SpyReducer";
import { ComponentProperties } from "reducers/components";

interface CompositionModelGlobalProps extends CompositionModelProps, CompositionModelCallbackProps {
    compositionModel: any;
};

interface CompositionModelProps {
    getAutoClear: () => boolean;
    getCurrentComponent: () => string;
    currentComponent: string;
    getDiagram: () => go.Diagram;
    getFirstId: (stateMachine: string) => string;
};

interface CompositionModelCallbackProps {
    initialization: (componentProperties: { [componentName: string]: ComponentProperties }, currentComponent: string, projectName: string) => void;
    showStateMachineProperties: (stateMachine: string, id: string) => void;
    updateGraphic: (component: string, stateMachine: string, data: any) => void;
    showTransitionProperties: (stateMachine: string, messageType: string, jsonMessageString: string, id: string, privateTopic: string) => void;
    clearFinalStates: (component: string, stateMachines: string[]) => void;
};

const mapStateToProps = (state: XCSpyState): CompositionModelProps => {
    return {
        getAutoClear: (): boolean => {
            return state.components.autoClear;
        },
        getCurrentComponent: (): string => {
            return state.components.currentComponent;
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
        },
        getFirstId: (stateMachine: string): string => {
            const componentProperties = state.components.componentProperties;
            const currentComponent = state.components.currentComponent;
            return Object.keys(componentProperties[currentComponent].stateMachineProperties[stateMachine])[0];
        }
    };
};

const mapDispatchToProps = (dispatch: Dispatch<void>): CompositionModelCallbackProps => {
    return {
        initialization: (componentProperties: { [componentName: string]: ComponentProperties }, currentComponent: string, projectName: string): void => {
            dispatch(initialization(componentProperties, currentComponent, projectName));
        },
        showStateMachineProperties: (stateMachine: string, id: string): void => {
            dispatch(showStateMachineProperties(stateMachine, id));
        },
        updateGraphic: (component: string, stateMachine: string, data: any): void => {
            dispatch(updateGraphic(component, stateMachine, data));
        },
        showTransitionProperties: (stateMachine: string, messageType: string, jsonMessageString: string, id: string, privateTopic: string): void => {
            dispatch(showTransitionProperties(stateMachine, messageType, jsonMessageString, id, privateTopic));
        },
        clearFinalStates: (component: string, stateMachines: string[]): void => {
            for (let i = 0; i < stateMachines.length; i++) {
                dispatch(clearFinalStates(component, stateMachines[i]));
            }
        }
    };
};

class CompositionModel extends React.Component<CompositionModelGlobalProps, XCSpyState> {
    constructor(props: CompositionModelGlobalProps) {
        super(props);
        this.getContainersForGraphs = this.getContainersForGraphs.bind(this);
        this.addDiagramEventClick = this.addDiagramEventClick.bind(this);
        this.subscribeAllStateMachines = this.subscribeAllStateMachines.bind(this);
        this.getFirstId = this.getFirstId.bind(this);
        this.snapshotEntryPoint = this.snapshotEntryPoint.bind(this);
        this.getCurrentComponent = this.getCurrentComponent.bind(this);
        this.getAutoClear = this.getAutoClear.bind(this);
    }

    getAutoClear(): boolean {
        return this.props.getAutoClear();
    }

    getFirstId(stateMachine: string): string {
        return this.props.getFirstId(stateMachine);
    }

    getCurrentComponent(): string {
        return this.props.getCurrentComponent();
    }

    addDiagramEventClick(diagram: go.Diagram): void {
        const props = this.props;
        diagram.addDiagramListener("ObjectDoubleClicked", ((diagramEvent: go.DiagramEvent) => {
            const data = diagramEvent.subject.part.data;
            console.error(data);
            if (data.isGroup) { // it is a stateMachine
                props.showStateMachineProperties(data.key, this.getFirstId(data.key));
            } else if (data.stateMachineTarget) { // it is a transition
                sessionXCSpy.getPromiseCreateSession()
                    .then((session) => {
                        if (session.createPublisher().canPublish(this.getCurrentComponent(), data.stateMachineTarget, data.messageType)) {
                            props.showTransitionProperties(data.stateMachineTarget, data.messageType, "{}", this.getFirstId(data.stateMachineTarget), sessionXCSpy.getDefaultPrivateTopic());
                        } else {
                            alert(`API cannot send ${data.messageType} event to ${data.stateMachineTarget}`);
                        }
                    });
            }
        }).bind(this));
    }

    subscribeAllStateMachines(component: string, stateMachines: string[]): void {
        const props = this.props;
        const thisObject = this;
        sessionXCSpy.getPromiseCreateSession()
            .then((session) => {
                const subscriber = session.createSubscriber();
                for (let j = 0; j < stateMachines.length; j++) {
                    if (!subscriber.canSubscribe(component, stateMachines[j]))
                        continue;
                    ((stateMachine) => {
                        subscriber.subscribe(component, stateMachine, (data) => {
                            props.updateGraphic(component, stateMachine, data);
                            if (thisObject.getAutoClear()) {
                                props.clearFinalStates(component, [stateMachine]);
                            }
                        });
                    })(stateMachines[j]);
                }
            });
    }

    snapshotEntryPoint(component: string, entryPoint: string): void {
        const props = this.props;
        sessionXCSpy.getPromiseCreateSession()
            .then((session) => {
                session.createSubscriber().getSnapshot(component, entryPoint, (items) => {
                    for (let i = 0; i < items.length; i++) {
                        props.updateGraphic(component, entryPoint, items[i]);
                    }
                });
            });
    }

    componentDidMount() {
        const props = this.props;
        const comps = props.compositionModel.components;
        const componentProperties = {};
        for (let i = 0; i < comps.length; i++) {
            const parser = new Parser(comps[i]);
            parser.parse();
            const drawComponent = new DrawComponent();
            drawComponent.draw(parser, comps[i].name);
            const stateMachineProperties = {};
            for (let k = 0; k < parser.getStateMachineNames().length; k++) {
                stateMachineProperties[parser.getStateMachineNames()[k]] = {};
            }
            componentProperties[comps[i].name] = {
                diagram: drawComponent.diagram,
                stateMachineProperties,
                finalStates: parser.getFinalStates(),
                entryPointState: parser.getEntryPointState()
            };
            this.addDiagramEventClick(drawComponent.diagram);
            this.subscribeAllStateMachines(comps[i].name, parser.getStateMachineNames());
            this.snapshotEntryPoint(comps[i].name, parser.getEntryPointStateMachine());
        }
        props.initialization(componentProperties, comps[0].name, props.compositionModel.projectName);
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
        const props = this.props;
        return (
            <Split flex="right">
                <SideBar />
                <Box full={true} direction="column">
                    <AppHeader />
                    <Box full={true}>
                        {this.getContainersForGraphs(props.getDiagram())}
                    </Box>
                    <Box >
                        <Footer />
                    </Box>
                    <Box >
                        {<StateMachineProperties />}
                    </Box>
                    <Box >
                        {<TransitionProperties />}
                    </Box>
                </Box>
            </Split>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompositionModel);