import "grommet/grommet-hpinc.min.css";
import * as React from "react";
import { connect } from "react-redux";
import { getApiList, selectApi, formSubmit } from "actions/configForm";
import { setCompositionModel, } from "actions/compositionModel";
import { updateGraphic } from "actions/components";
import { Parser } from "../utils/parser";
import { DrawComponent } from "../utils/drawComponent";
import { initialization } from "actions/components";
import SideBar from "components/SideBar";
import * as Split from "grommet/components/Split";
import * as Box from "grommet/components/Box";
import Footer from "components/Footer";
import * as Anchor from "grommet/components/Anchor";
import * as Menu from "grommet/components/Menu";
import { showStateMachineProperties } from "actions/stateMachineProperties";
import StateMachineProperties from "components/StateMachineProperties";
import MenuSpy from "components/MenuSpy";
import sessionXCSpy from "utils/sessionXCSpy";
import * as go from "gojs";

const mapStateToProps = (state) => {
    return {
        currentComponent: state.components.currentComponent,
        getDiagram: () => {
            let initialized = state.components.initialized;
            if (!initialized) {
                return null;
            } else {
                let currentComponent = state.components.currentComponent;
                let componentProperties = state.components.componentProperties;
                return componentProperties[currentComponent].diagram;
            }
        },
        getFirstId: (stateMachine) => {
            let componentProperties = state.components.componentProperties;
            let currentComponent = state.components.currentComponent;
            return Object.keys(componentProperties[currentComponent].stateMachineProperties[stateMachine])[0];
        }
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        initialization: (componentProperties, currentComponent, projectName) => {
            dispatch(initialization(componentProperties, currentComponent, projectName));
        },
        showStateMachineProperties: (stateMachine, id) => {
            dispatch(showStateMachineProperties(stateMachine, id));
        },
        updateGraphic: (component, stateMachine, data) => {
            dispatch(updateGraphic(component, stateMachine, data));
        }
    };
};

class CompositionModel extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.getContainersForGraphs = this.getContainersForGraphs.bind(this);
        this.addDiagramEventClick = this.addDiagramEventClick.bind(this);
        this.subscribeAllStateMachines = this.subscribeAllStateMachines.bind(this);
        this.getFirstId = this.getFirstId.bind(this);
    }

    getFirstId(stateMachine) {
        return this.props.getFirstId(stateMachine);
    }

    addDiagramEventClick(diagram) {
        let props = this.props;
        diagram.addDiagramListener("ObjectDoubleClicked", (function (diagramEvent: go.DiagramEvent) {
            let data = diagramEvent.subject.part.data;
            if (data.isGroup) { // it is a stateMachine
                props.showStateMachineProperties(data.key, this.getFirstId(data.key));
            }
        }).bind(this));
    }

    subscribeAllStateMachines(component, stateMachines) {
        let props = this.props;
        sessionXCSpy.getPromiseCreateSession()
            .then((session) => {
                let subscriber = session.createSubscriber();
                for (let j = 0; j < stateMachines.length; j++) {
                    if (!subscriber.canSubscribe(component, stateMachines[j]))
                        continue;
                    ((stateMachine) => {
                        subscriber.subscribe(component, stateMachine, (data) => {
                            console.error(data);
                            props.updateGraphic(component, stateMachine, data);
                        });
                    })(stateMachines[j]);
                }
            });
    }

    componentDidMount() {
        const props = this.props;
        let comps = props.compositionModel.components;
        let componentProperties = {};
        for (let i = 0; i < comps.length; i++) {
            let parser = new Parser(comps[i]);
            parser.parse();
            let drawComponent = new DrawComponent();
            drawComponent.draw(parser, comps[i].name);
            let stateMachineProperties = {};
            for (let k = 0; k < parser.stateMachineNames.length; k++) {
                stateMachineProperties[parser.stateMachineNames[k]] = {};
            }
            componentProperties[comps[i].name] = {
                diagram: drawComponent.diagram,
                stateMachineProperties
            };
            this.addDiagramEventClick(drawComponent.diagram);
            this.subscribeAllStateMachines(comps[i].name, parser.stateMachineNames);
        }
        props.initialization(componentProperties, comps[0].name, props.compositionModel.projectName);
    }

    getContainersForGraphs(diagram) {
        let props = this.props;
        let divs = [];
        let comps = props.compositionModel.components;
        let visibility;
        for (let i = 0; i < comps.length; i++) {
            visibility = (comps[i].name === props.currentComponent) ? "block" : "none";
            divs.push(
                <div
                    key={comps[i].name}
                    id={comps[i].name}
                    style={{
                        "height": "100%",
                        "width": "100%",
                        "display": visibility,
                        "backgroundColor": "LightGrey"
                    }}></div>
            );
            if (diagram) {
                diagram.requestUpdate();
            }
        }
        return divs;
    }

    render() {
        const props = this.props;
        return (
            <Split flex="right">
                <SideBar />
                <Box full={true} direction="column">
                    <Box >
                        <MenuSpy />
                    </Box>
                    <Box>
                        {this.getContainersForGraphs(props.getDiagram())}
                    </Box>
                    <Box >
                        <Footer />
                    </Box>
                    <Box >
                        {<StateMachineProperties />}
                    </Box>
                </Box>
            </Split>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompositionModel);