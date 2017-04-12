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
import { updateGraphic, clearFinalStates, setAutoClear, snapshotAllAction } from "actions";
import { XCSpyState } from "reducers/spyReducer";
import { Dispatch } from "redux";
import { snapshotAll } from "core";

interface AppHeaderGlobalProps extends AppHeaderProps, AppHeaderCallbackProps {
};

interface AppHeaderProps {
    currentComponent: string;
    getStateMachines: (component: string) => string[];
    components: string[];
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
    const initialized = state.components.initialized;
    const componentProperties = state.components.componentProperties;
    const components = (!initialized) ? [] : Object.keys(componentProperties);
    return {
        currentComponent: state.components.currentComponent,
        getStateMachines: (component: string): string[] => {
            if (!initialized)
                return [];
            return Object.keys(componentProperties[component].stateMachineProperties);
        },
        components: components,
        autoClear: state.components.autoClear,
        sideBar: state.sideBar.isVisible
    };
};

const mapDispatchToProps = (dispatch: Dispatch<XCSpyState>): AppHeaderCallbackProps => {
    return {
        clearFinalStates: (component: string, stateMachines: string[]): void => {
            for (let i = 0; i < stateMachines.length; i++) {
                dispatch(clearFinalStates(component, stateMachines[i]));
            }
        },
        showSideBar: (): void => {
            dispatch(showSideBar());
        },
        hideSideBar: (): void => {
            dispatch(hideSideBar());
        },
        snapshotAll: (component: string, stateMachines: string[]): void => {
            dispatch(snapshotAllAction(component, stateMachines));
        },
        setAutoClear: (autoClear: boolean): void => {
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
    components,
    sideBar,
    hideSideBar
}: AppHeaderGlobalProps) => {
    const menuSpy = (
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
            <Box justify="center" size="large" basis="1/3">
                {menuSpy}
            </Box>
            <Box align="center" justify="center" size="large" basis="1/3">
                <Title>
                    XCSpy Application
                </Title>
            </Box>
            <Box align="end" justify="center" size="large" basis="1/3">
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