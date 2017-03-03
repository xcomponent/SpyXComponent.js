import * as React from "react";
import * as Anchor from "grommet/components/Anchor";
import * as Menu from "grommet/components/Menu";
import * as Actions from "grommet/components/icons/base/Actions";
import { connect } from "react-redux";
import { showSideBar } from "actions/sideBar";

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showSideBar: () => {
            dispatch(showSideBar());
        }
    };
};

const MenuSpy = ({
    showSideBar
}) => {
    return (
        <Menu
            responsive={true}
            primary={true}
            inline={false}
            icon={<Actions />}>
            <Anchor href="#">
                Snapshot All
            </Anchor>
            <Anchor href="#">
                Clear All
            </Anchor>
            <Anchor href="#" onClick={showSideBar}>
                SideBar
            </Anchor>
        </Menu>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuSpy);