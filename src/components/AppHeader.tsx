import * as React from "react";
import * as Anchor from "grommet/components/Anchor";
import * as Menu from "grommet/components/Menu";
import * as Box from "grommet/components/Box";
import * as Title from "grommet/components/Title";
import * as CheckBox from "grommet/components/CheckBox";
import * as Button from "grommet/components/Button";
import * as HomeIcon from "grommet/components/icons/base/home";
import * as MenuIcon from "grommet/components/icons/base/Menu";
import { connect } from "react-redux";
import { showSideBar, hideSideBar } from "actions/sideBar";
import sessionXCSpy from "utils/sessionXCSpy";
import { updateGraphic, clearFinalStates, setAutoClear } from "actions/components";
import { XCSpyState } from "reducers/spyReducer";

interface AppHeaderGlobalProps extends AppHeaderProps, AppHeaderCallbackProps {
};

interface AppHeaderProps {
    currentComponent: string;
    getStateMachines: (component: string) => string[];
    getComponents: () => string[];
    autoClear: boolean;
    sideBar: boolean;
};

interface AppHeaderCallbackProps {
    clearFinalStates: (component: string, stateMachines: string[]) => void;
    showSideBar: () => void;
    hideSideBar: () => void;
    snapshotAll: (component: string, stateMachines: string[]) => void;
    setAutoClear: (autoClear: boolean) => void;
};

const mapStateToProps = (state: XCSpyState): AppHeaderProps => {
    return {
        currentComponent: state.components.currentComponent,
        getStateMachines: (component) => {
            let initialized = state.components.initialized;
            if (!initialized)
                return [];
            let componentProperties = state.components.componentProperties;
            return Object.keys(componentProperties[component].stateMachineProperties);
        },
        getComponents: () => {
            let initialized = state.components.initialized;
            if (!initialized)
                return [];
            return Object.keys(state.components.componentProperties);
        },
        autoClear: state.components.autoClear,
        sideBar: state.sideBar.isVisible
    };
};

const mapDispatchToProps = (dispatch): AppHeaderCallbackProps => {
    return {
        clearFinalStates: (component, stateMachines) => {
            for (let i = 0; i < stateMachines.length; i++) {
                dispatch(clearFinalStates(component, stateMachines[i]));
            }
        },
        showSideBar: () => {
            dispatch(showSideBar());
        },
        hideSideBar: () => {
            dispatch(hideSideBar());
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
        },
        setAutoClear: (autoClear) => {
            dispatch(setAutoClear(autoClear));
        }
    };
};

const AppHeader = ({
    showSideBar,
    getStateMachines,
    currentComponent,
    snapshotAll,
    clearFinalStates,
    autoClear,
    setAutoClear,
    getComponents,
    sideBar,
    hideSideBar
}: AppHeaderGlobalProps) => {
    let menuSpy = (
        <Menu
            responsive={true}
            primary={true}
            inline={false}
            title="Menu"
            icon={<MenuIcon size="medium" />}>
            <Anchor href="#" onClick={() => {
                snapshotAll(currentComponent, getStateMachines(currentComponent));
            }}>
                Snapshot All
            </Anchor>
            <Anchor href="#" onClick={() => {
                clearFinalStates(currentComponent, getStateMachines(currentComponent));
            }}>
                Clear All
            </Anchor>
            <Anchor href="#" onClick={() => {
                (!sideBar) ? showSideBar() : hideSideBar();
            }}>
                <CheckBox label="SideBar" toggle={true} checked={sideBar} onChange={() => { }} />
            </Anchor>

            <Anchor href="#" onClick={() => {
                if (!autoClear) {
                    let components = getComponents();
                    for (let i = 0; i < components.length; i++) {
                        clearFinalStates(components[i], getStateMachines(components[i]));
                    }
                }
                setAutoClear(!autoClear);
            }} >
                <CheckBox label="autoClear" toggle={true} checked={autoClear} onChange={() => { }} />
            </Anchor>

        </Menu>
    );

    return (
        <Box direction="row">
            <Box justify="center" size="large">
                {menuSpy}
            </Box>
            <Box align="center" justify="center" size="large">
                <Title>
                    XCSpy Application
                </Title>
            </Box>
            <Box align="end" justify="center" size="large">
                <Button title={"Home"} icon={<HomeIcon size="medium" />}
                    onClick={() => {
                        window.location.reload();
                    }}
                />
            </Box>
        </Box>

    );
};

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);