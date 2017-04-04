import * as React from "react";
import * as GrommetSidebar from "grommet/components/Sidebar";
import * as Header from "grommet/components/Header";
import * as Title from "grommet/components/Title";
import * as Box from "grommet/components/Box";
import * as Menu from "grommet/components/Menu";
import * as Anchor from "grommet/components/Anchor";
import * as Footer from "grommet/components/Footer";
import * as Button from "grommet/components/Button";
import { Link } from "react-router";
import * as CloseIcon from "grommet/components/icons/base/Close";

import * as User from "grommet/components/icons/base/User";
import { connect } from "react-redux";
import { setCurrentComponent, hideSideBar } from "actions";
import { XCSpyState } from "reducers/spyReducer";
import { Dispatch } from "redux";

interface SideBarGlobalProps extends SideBarProps, SideBarCallbackProps {
};

interface SideBarProps {
    isVisible: boolean;
    initialized: boolean;
    components: string[];
    currentComponent: string;
    projectName: string;
};

interface SideBarCallbackProps {
    setCurrentComponent: (currentComponent: string) => void;
    hideSideBar: () => void;
};

const mapStateToProps = (state: XCSpyState): SideBarProps => {
    return {
        isVisible: state.sideBar.isVisible,
        initialized: state.components.initialized,
        components: Object.keys(state.components.componentProperties),
        currentComponent: state.components.currentComponent,
        projectName: state.components.projectName
    };
};

const mapDispatchToProps = (dispatch: Dispatch<void>): SideBarCallbackProps => {
    return {
        setCurrentComponent: (currentComponent: string) => {
            dispatch(setCurrentComponent(currentComponent));
        },
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

    getComponentList(): Anchor[] {
        const list = [];
        const props = this.props;
        const components = props.components;
        components.map((component: string) => {
            list.push(
                <Anchor
                    primary={true}
                    key={component}
                    value={component}
                    className={(props.currentComponent === component) ? "active" : ""}
                    onClick={(e) => {
                        props.setCurrentComponent(e.target.getAttribute("value"));
                    }}>
                    {component}
                </Anchor>
            );
        });
        for (let i = 0; i < components.length; i++) {
        }
        return list;
    }

    render() {
        if (!this.props.initialized || !this.props.isVisible)
            return null;
        return (
            <GrommetSidebar fixed={true} colorIndex="neutral-1">
                {this.getTitle()}
                <Menu>
                    {this.getComponentList()}
                </Menu>
            </GrommetSidebar>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);