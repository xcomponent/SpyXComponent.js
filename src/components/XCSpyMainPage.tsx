import { Provider, connect } from "react-redux";
import * as React from "react";
import Components from "./Components";
import SideBar from "components/SideBar";
import * as Split from "grommet/components/Split";
import * as Box from "grommet/components/Box";
import AppHeader from "components/AppHeader";
import Footer from "components/Footer";
import TransitionProperties from "components/TransitionProperties";
import StateMachineProperties from "components/StateMachineProperties";
import { XCSpyState } from "reducers/SpyReducer";
import { Dispatch } from "redux";
import { setCompositionModel } from "actions";
import { withRouter, Redirect } from "react-router-dom";
import sessionXCSpy from "utils/sessionXCSpy";
import { API, CURRENT_COMPONENT, SERVER_URL } from "utils/urlParams";

interface XCSpyMainPageGlobalProps extends XCSpyMainPageProps, XCSpyMainPageCallbackProps {
};

interface XCSpyMainPageProps {
    initialized: boolean;
    api: string;
    serverUrl: string;
    currentComponent: string;
};

interface XCSpyMainPageCallbackProps {
    setCompositionModel: (xcApiName: string, serverUrl: string) => void;
};

class XCSpyMainPage extends React.Component<XCSpyMainPageGlobalProps, XCSpyState> {
    constructor(props: XCSpyMainPageGlobalProps) {
        super(props);
    }

    componentWillMount() {
        if (!this.props.initialized) {
            const serverUrl = this.props.serverUrl;
            const api = this.props.api;
            sessionXCSpy.init(api, serverUrl);
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

const mapStateToProps = (state: XCSpyState, ownProps): XCSpyMainPageProps => {
    const urlSearchParams = new URLSearchParams(ownProps.location.search);
    const currentComponent = urlSearchParams.get(CURRENT_COMPONENT);
    const serverUrl = urlSearchParams.get(SERVER_URL);
    const api = urlSearchParams.get(API);
    return {
        initialized: state.compositionModel.initialized,
        api,
        serverUrl,
        currentComponent
    };
};

const mapDispatchToProps = (dispatch: Dispatch<XCSpyState>): XCSpyMainPageCallbackProps => {
    return {
        setCompositionModel: (xcApiName: string, serverUrl: string) => {
            dispatch(setCompositionModel(xcApiName, serverUrl));
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(XCSpyMainPage));
