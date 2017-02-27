import "grommet/grommet-hpinc.min.css";
import * as React from "react";
import { connect } from "react-redux";
import { getApiList, selectApi, formSubmit } from "actions/configForm";
import { setCompositionModel } from "actions/compositionModel";
import { Parser } from "../utils/parser";
import { DrawComponent } from "../utils/drawComponent";
import { initialization } from "actions/components";
import SideBar from "components/SideBar";
import * as Split from "grommet/components/Split";
import * as Box from "grommet/components/Box";
import Footer from "components/Footer";

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
        }
    };
};

class CompositionModel extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.getContainersForGraphs = this.getContainersForGraphs.bind(this);
    }

    componentDidMount() {
        const props = this.props;
        let comps = props.compositionModel.components;
        let componentProperties = {};
        for (let i = 0; i < comps.length; i++) {
            let parser = new Parser();
            parser.parseGraphical(comps[i].graphical);
            parser.parseModel(comps[i].model);
            let drawComponent = new DrawComponent();
            drawComponent.draw(parser, comps[i].name);
            componentProperties[comps[i].name] = {
                drawComponent: drawComponent
            };
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
            try {
                drawComponent.diagram.requestUpdate();
            } catch (e) {
            }
        }
        return divs;
    }

    render() {
        const props = this.props;
        return (
            <Box direction="column">
                <Box>
                    <Split flex="right">
                        <SideBar />
                        <Box full={true}>
                            {this.getContainersForGraphs(props.getDrawComponent())}
                        </Box>
                    </Split>
                </Box>
                <Box>
                </Box>
            </Box>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompositionModel);