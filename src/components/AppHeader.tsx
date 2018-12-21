import * as React from "react";
import * as Anchor from "grommet/components/Anchor";
import * as Menu from "grommet/components/Menu";
import * as Box from "grommet/components/Box";
import * as Title from "grommet/components/Title";
import * as CheckBox from "grommet/components/CheckBox";
import * as Button from "grommet/components/Button";
import * as HomeIcon from "grommet/components/icons/base/Home";
import * as MenuIcon from "grommet/components/icons/base/Menu";
import { connect } from "react-redux";
import { showSideBar, hideSideBar } from "../actions/sideBar";
import { updateGraphic, clearFinalStates, setAutoClear, snapshotAllAction, logout } from "../actions";
import { XCSpyState } from "../reducers/spyReducer";
import { Dispatch, Action } from "redux";
import { snapshotAll } from "core";
import { BrowserRouter as Router, Route, Link, withRouter, Redirect } from "react-router-dom";
import { routes } from "../utils/routes";
import { injectIntl, InjectedIntl } from "react-intl";

interface AppHeaderGlobalProps extends AppHeaderProps, AppHeaderCallbackProps {
}

interface AppHeaderProps {
    intl?: InjectedIntl;
    currentComponent: string;
    getStateMachines: (component: string) => string[];
    components: string[];
    autoClear: boolean;
    sideBar: boolean;
}

interface AppHeaderCallbackProps {
    returnHome: () => void;
    clearFinalStates: (component: string, stateMachines: string[]) => void;
    showSideBar: () => void;
    hideSideBar: () => void;
    snapshotAll: (component: string, stateMachines: string[]) => void;
    setAutoClear: (autoClear: boolean) => void;
}

const mapStateToProps = (state: XCSpyState, ownProps): AppHeaderProps => {
    const initialized = state.components.initialized;
    const componentProperties = state.components.componentProperties;
    const components = (!initialized) ? [] : Object.keys(componentProperties);
    const urlSearchParams = new URLSearchParams(ownProps.location.search);
    const currentComponent = urlSearchParams.get(routes.params.currentComponent);
    return {
        currentComponent,
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

const mapDispatchToProps = (dispatch, ownProps): AppHeaderCallbackProps => {
    return {
        returnHome: (): void => {
            dispatch(logout());
            ownProps.history.push(routes.paths.home);
        },
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
    intl,
    returnHome,
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
            title={intl.formatMessage({ id: "app.menu" })}
            icon={<MenuIcon size="medium" />}>
            <Anchor onClick={() => {
                snapshotAll(currentComponent, getStateMachines(currentComponent));
            }}>
                {intl.formatMessage({ id: "app.snapshot.all" })}
            </Anchor>
            <Anchor onClick={() => {
                clearFinalStates(currentComponent, getStateMachines(currentComponent));
            }}>
                {intl.formatMessage({ id: "app.clear.all" })}
            </Anchor>
            <Anchor onClick={() => {
                (!sideBar) ? showSideBar() : hideSideBar();
            }}>
                <CheckBox label={intl.formatMessage({ id: "app.side.bar" })} toggle={true} checked={sideBar} onChange={() => { }} />
            </Anchor>

            <Anchor>
                {<CheckBox label={intl.formatMessage({ id: "app.auto.clear" })} toggle={true} checked={autoClear} onChange={() => {
                    for (let i = 0; i < components.length; i++) {
                        clearFinalStates(components[i], getStateMachines(components[i]));
                    }
                    setAutoClear(!autoClear);
                }} />}
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
                    {intl.formatMessage({ id: "app.title" })}
                </Title>
            </Box>
            <Box align="end" justify="center" size="large" basis="1/3">
                <Button title={intl.formatMessage({ id: "app.home" })} icon={<HomeIcon size="medium" />}
                    onClick={returnHome}
                />
            </Box>
        </Box>
    );
};

export default withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(AppHeader)));