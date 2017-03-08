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
import { setCurrentComponent } from "actions/components";
import { hideSideBar } from "actions/sideBar";

const mapStateToProps = (state) => {
    return {
        active: state.sideBar,
        initialized: state.components.initialized,
        components: state.components.componentProperties,
        currentComponent: state.components.currentComponent,
        projectName: state.components.projectName
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentComponent: (currentComponent) => {
            dispatch(setCurrentComponent(currentComponent));
        },
        hideSideBar: () => {
            dispatch(hideSideBar());
        }
    };
};

class SideBar extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.getTitle = this.getTitle.bind(this);
        this.getComponentList = this.getComponentList.bind(this);
    }

    getTitle() {
        return (
            <Header size="large" justify="between">
                <Box pad="medium">
                    <Title>
                        {this.props.projectName}
                    </Title>
                </Box>
                <Button icon={<CloseIcon />} onClick={this.props.hideSideBar} plain={true} />
            </Header>
        );
    }

    getComponentList() {
        let list = [];
        let props = this.props;
        let components = Object.keys(props.components);
        for (let i = 0; i < components.length; i++) {
            list.push(
                <Anchor
                    primary={true}
                    key={components[i]}
                    value={components[i]}
                    className={(props.currentComponent === components[i]) ? "active" : ""}
                    href="#"
                    onClick={(e) => {
                        props.setCurrentComponent(e.target.getAttribute("value"));
                    }}>
                    {components[i]}
                </Anchor>
            );
        }
        return list;
    }

    render() {
        if (!this.props.initialized || !this.props.active)
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