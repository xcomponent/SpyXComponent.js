import * as React from "react";
import * as GrommetSidebar from "grommet/components/Sidebar";
import * as Header from "grommet/components/Header";
import * as Title from "grommet/components/Title";
import * as Box from "grommet/components/Box";
import * as Menu from "grommet/components/Menu";
import * as Anchor from "grommet/components/Anchor";
import * as Footer from "grommet/components/Footer";
import * as Button from "grommet/components/Button";
import * as CloseIcon from "grommet/components/icons/base/Close";

import * as User from "grommet/components/icons/base/User";
import { connect } from "react-redux";
import { hideSideBar } from "actions";
import { XCSpyState } from "reducers/spyReducer";
import { Dispatch } from "redux";
import { Link, withRouter } from "react-router-dom";

interface SideBarGlobalProps extends SideBarProps, SideBarCallbackProps {
};

interface SideBarProps {
    isVisible: boolean;
    initialized: boolean;
    components: string[];
    currentComponent: string;
    projectName: string;
    serverUrl: string;
    api: string;
};

interface SideBarCallbackProps {
    hideSideBar: () => void;
};

const mapStateToProps = (state: XCSpyState, ownProps): SideBarProps => {
    return {
        isVisible: state.sideBar.isVisible,
        initialized: state.components.initialized,
        components: Object.keys(state.components.componentProperties),
        currentComponent: ownProps.match.params.currentComponent,
        projectName: state.components.projectName,
        serverUrl: ownProps.match.params.serverUrl,
        api: ownProps.match.params.api
    };
};

const mapDispatchToProps = (dispatch: Dispatch<XCSpyState>): SideBarCallbackProps => {
    return {
        hideSideBar: () => {
            dispatch(hideSideBar());
        }
    };
};

class SideBar extends React.Component<SideBarGlobalProps, XCSpyState> {
    constructor(props: SideBarGlobalProps) {
        super(props);
        this.getTitle = this.getTitle.bind(this);
        this.getComponentList = this.getComponentList.bind(this);
    }

    getTitle(): Box {
        return (
            <Box direction="row">
                <Box size="medium" pad="medium" justify="between">
                    <Title>
                        {this.props.projectName}
                    </Title>
                </Box>
                <Box size="large" align="end">
                    <Button icon={<CloseIcon size="medium" />} onClick={this.props.hideSideBar} plain={true} />
                </Box>
            </Box>
        );
    }

    getComponentList() {
        const list = [];
        const props = this.props;
        const components = props.components;
        components.map((component: string) => {
            list.push(
                <Link
                    key={component}
                    value={component}
                    to={`/${props.serverUrl}/${props.api}/${component}`}
                    className={(props.currentComponent === component) ? "active" : ""}>
                    {component}
                </Link>
            );
        });
        return list;
    }

    render() {
        if (!this.props.initialized || !this.props.isVisible)
            return null;
        return (
            <GrommetSidebar fixed={true} colorIndex="neutral-1">
                {this.getTitle()}
                <Menu primary={true}>
                    {this.getComponentList()}
                </Menu>
            </GrommetSidebar>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SideBar));