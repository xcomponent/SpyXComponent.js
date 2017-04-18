import { Provider, connect } from "react-redux";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import * as App from "grommet/components/App";
import ConfigForm from "./components/ConfigForm";
import { SpyReducer, XCSpyState } from "./reducers/SpyReducer";
import * as logger from "redux-logger";
import thunk from "redux-thunk";
import Components from "./components/Components";
import { setCompositionModel } from "actions/compositionModel";
import sessionXCSpy from "utils/sessionXCSpy";
import { Dispatch } from "redux";
import { Parser } from "utils/parser";
import { subscribeAllStateMachines, snapshotEntryPoint } from "core";
import SideBar from "components/SideBar";
import * as Split from "grommet/components/Split";
import * as Box from "grommet/components/Box";
import AppHeader from "components/AppHeader";
import Footer from "components/Footer";
import TransitionProperties from "components/TransitionProperties";
import StateMachineProperties from "components/StateMachineProperties";
import { BrowserRouter as Router, Route, Link, withRouter, Redirect } from "react-router-dom";
import XCSpyMainPage from "components/XCSpyMainPage";
import {API, CURRENT_COMPONENT, SERVER_URL } from "utils/urlParams";

const middleware = applyMiddleware(thunk, logger());
const store = createStore(SpyReducer, middleware);

interface XCSpyGlobalProps extends XCSpyProps, XCSpyCallbackProps {
  history: any;
};

interface XCSpyProps {
  submitted: boolean;
  selectedApi: string;
  serverUrl: string;
  compositionModel: any;
};

interface XCSpyCallbackProps {
  setCompositionModel: (xcApiName: string, serverUrl: string) => void;
};

let XCSpyApp = (props: XCSpyGlobalProps) => {
  if (!props.submitted) {
    return (
      <ConfigForm />
    );
  }
  if (props.submitted && !props.compositionModel.initialized) {
    props.setCompositionModel(props.selectedApi, props.serverUrl);
    return (
      <ConfigForm />
    );
  }
  sessionXCSpy.init(props.selectedApi, props.serverUrl);


  const currentComponent = props.compositionModel.value.components[0].name;

  return (
    <Redirect to={{ pathname: "/app/", search: `${SERVER_URL}=${props.serverUrl}&${API}=${props.selectedApi}&${CURRENT_COMPONENT}=${currentComponent}` }} />
  );
};

const mapStateToProps = (state: XCSpyState) => {
  return {
    submitted: state.configForm.formSubmited,
    selectedApi: state.configForm.selectedApi,
    serverUrl: state.configForm.serverUrl,
    compositionModel: state.compositionModel
  };
};

const mapDispatchToProps = (dispatch: Dispatch<XCSpyState>) => {
  return {
    setCompositionModel: (xcApiName: string, serverUrl: string) => {
      dispatch(setCompositionModel(xcApiName, serverUrl));
    }
  };
};

XCSpyApp = connect(mapStateToProps, mapDispatchToProps)(XCSpyApp);

ReactDOM.render(
  <Provider store={store} >
    <Router>
      <div>
        <Route exact path="/" component={XCSpyApp} />
        <Route path="/app" component={XCSpyMainPage} />
      </div>
    </Router>
  </Provider>,
  document.getElementById("app")
);