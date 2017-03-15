import * as React from "react";
import * as Anchor from "grommet/components/Anchor";
import * as Menu from "grommet/components/Menu";
import * as MenuIcon from "grommet/components/icons/base/Menu";
import { connect } from "react-redux";
import { showSideBar } from "actions/sideBar";
import sessionXCSpy from "utils/sessionXCSpy";
import { updateGraphic, clearFinalStates } from "actions/components";

const mapStateToProps = (state) => {
    return {
        currentComponent: state.components.currentComponent,
        getStateMachines: () => {
            let initialized = state.components.initialized;
            if (!initialized)
                return [];
            let componentProperties = state.components.componentProperties;
            let currentComponent = state.components.currentComponent;
            return Object.keys(componentProperties[currentComponent].stateMachineProperties);
        }
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        clearFinalStates: (component, stateMachines) => {
            for (let i = 0; i < stateMachines.length; i++) {
                dispatch(clearFinalStates(component, stateMachines[i]));
            }
        },
        showSideBar: () => {
            dispatch(showSideBar());
        },
        snapshotAll: (component, stateMachines) => {
            dispatch((dispatch) => {
                sessionXCSpy.getPromiseCreateSession()
                    .then((session) => {
                        let subscriber = session.createSubscriber();
                        for (let i = 0; i < stateMachines.length; i++) {
                            subscriber.getSnapshot(component, stateMachines[i], (items) => {
                                console.log(items);
                                for (let j = 0; j < items.length; j++) {
                                    dispatch(updateGraphic(component, stateMachines[i], items[j]));
                                }
                            });
                        }
                    });
            });
        }
    };
};

const MenuSpy = ({
    showSideBar,
    getStateMachines,
    currentComponent,
    snapshotAll,
    clearFinalStates
}) => {
    return (
        <Menu
            responsive={true}
            primary={true}
            inline={false}
            icon={<MenuIcon />}>
            <Anchor href="#" onClick={() => {
                snapshotAll(currentComponent, getStateMachines());
            }}>
                Snapshot All
            </Anchor>
            <Anchor href="#" onClick={() => {
                clearFinalStates(currentComponent, getStateMachines());
            }}>
                Clear All
            </Anchor>
            <Anchor href="#" onClick={showSideBar}>
                SideBar
            </Anchor>
        </Menu>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuSpy);