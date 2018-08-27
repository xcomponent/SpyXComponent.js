import { Provider, connect } from "react-redux";
import * as React from "react";
import Components from "./Components";
import SideBar from "./SideBar";
import * as Split from "grommet/components/Split";
import * as Box from "grommet/components/Box";
import AppHeader from "./AppHeader";
import Footer from "./Footer";
import TransitionProperties from "./TransitionProperties";
import StateMachineProperties from "./StateMachineProperties";
import { XCSpyState } from "../reducers/spyReducer";
import { Dispatch } from "redux";
import { setCompositionModel, initSession } from "../actions";
import { withRouter, Redirect } from "react-router-dom";
import { routes } from "../utils/routes";
import * as queryString from "query-string";

interface XCSpyAppGlobalProps extends XCSpyAppProps, XCSpyAppCallbackProps {
}

interface XCSpyAppProps {
    initialized: boolean;
    api: string;
    serverUrl: string;
    currentComponent: string;
}

interface XCSpyAppCallbackProps {
    setCompositionModel: (xcApiName: string, serverUrl: string) => void;
    initSession: (xcApiName: string, serverUrl: string) => void;
}

class XCSpyApp extends React.Component<XCSpyAppGlobalProps, XCSpyState> {
    constructor(props: XCSpyAppGlobalProps) {
        super(props);
    }

    componentWillMount() {
        if (!this.props.initialized) {
            const serverUrl = this.props.serverUrl;
            const api = this.props.api;
            this.props.initSession(api, serverUrl);
            this.props.setCompositionModel(api, serverUrl);
        }
    }

    render() {
        if (!this.props.initialized) {
            return (<div>
                Loading...
            </div>);
        }
        return (
            <Split flex="right">
                <SideBar />
                <Box full={true} direction="column">
                    <AppHeader />
                    <Components />
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

const mapStateToProps = (state: XCSpyState, ownProps): XCSpyAppProps => {
    const values = queryString.parse(ownProps.location.search);
    const currentComponent = values[routes.params.currentComponent];
    const serverUrl = values[routes.params.serverUrl];
    const api = values[routes.params.api];
    return {
        initialized: state.compositionModel.initialized,
        api,
        serverUrl,
        currentComponent
    };
};

const mapDispatchToProps = (dispatch: Dispatch<XCSpyState>): XCSpyAppCallbackProps => {
    return {
        setCompositionModel: (xcApiName: string, serverUrl: string): void => {
            dispatch(setCompositionModel(xcApiName, serverUrl));
        },
        initSession: (xcApiName: string, serverUrl: string): void => {
            dispatch(initSession(xcApiName, serverUrl));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(XCSpyApp);
