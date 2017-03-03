import "grommet/grommet-hpinc.min.css";
import * as React from "react";
import { connect } from "react-redux";
import { getApiList, selectApi, formSubmit } from "actions/configForm";
import { setCompositionModel,  } from "actions/compositionModel";
import { updateStateMachine } from "actions/components";
import { Parser } from "../utils/parser";
import { DrawComponent } from "../utils/drawComponent";
import { initialization } from "actions/components";
import SideBar from "components/SideBar";
import * as Split from "grommet/components/Split";
import * as Box from "grommet/components/Box";
import Footer from "components/Footer";
import * as Anchor from "grommet/components/Anchor";
import * as Menu from "grommet/components/Menu";
import { showPopUp, hidePopUp } from "actions/popUpStateMachine";
import PopUpStateMachine from "components/PopUpStateMachine";
import MenuSpy from "components/MenuSpy";
import sessionXCSpy from "utils/sessionXCSpy";

const mapStateToProps = (state) => {
    return {
        currentComponent: state.components.currentComponent,
        getDrawComponent: () => {
            let initialized = state.components.initialized;
            if (!initialized) {
                return null;
            } else {
                let currentComponent = state.components.currentComponent;
                let componentProperties = state.components.componentProperties;
                return componentProperties[currentComponent].drawComponent;
            }
        }
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        initialization: (componentProperties, currentComponent, projectName) => {
            dispatch(initialization(componentProperties, currentComponent, projectName));
        },
        showPopUpStateMachine: (stateMachine) => {
            dispatch(showPopUp(stateMachine));
        },
        updateStateMachine: (component, stateMachine) => {
            dispatch(updateStateMachine(component, stateMachine));
        }
    };
};

class CompositionModel extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.getContainersForGraphs = this.getContainersForGraphs.bind(this);
        this.addDiagramEventClick = this.addDiagramEventClick.bind(this);
        this.subscribeAllStateMachines = this.subscribeAllStateMachines.bind(this);
    }

    addDiagramEventClick(drawComponent) {
        drawComponent.diagram.addDiagramListener("ObjectDoubleClicked", (function (ev) {
            let data = ev.subject.part.data;
            console.error(data);
            if (data.isGroup) { // it is a stateMachine
                this.props.showPopUpStateMachine(data.key);
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
                            props.updateStateMachine(component, stateMachine);
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
            componentProperties[comps[i].name] = {
                drawComponent: drawComponent
            };
            this.addDiagramEventClick(drawComponent);
            this.subscribeAllStateMachines(comps[i].name, parser.stateMachineNames);
        }
        props.initialization(componentProperties, comps[0].name, props.compositionModel.projectName);
    }

    getContainersForGraphs(drawComponent) {
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
            if (drawComponent) {
                drawComponent.diagram.requestUpdate();
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
                        {this.getContainersForGraphs(props.getDrawComponent())}
                    </Box>
                    <Box >
                        <Footer />
                    </Box>
                    <Box >
                        {<PopUpStateMachine />}
                    </Box>
                </Box>
            </Split>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompositionModel);