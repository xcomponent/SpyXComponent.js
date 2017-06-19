import { Provider, connect } from "react-redux";
import * as React from "react";
import ConfigForm from "./ConfigForm";
import Components from "./Components";
import { setCompositionModel } from "actions/compositionModel";
import sessionXCSpy from "utils/sessionXCSpy";
import { Dispatch } from "redux";
import { Parser } from "utils/parser";
import { BrowserRouter as Router, Route, Link, withRouter, Redirect } from "react-router-dom";
import { routes } from "utils/routes";
import { XCSpyState } from "reducers/spyReducer";
import { initSession } from "actions";
import { xcMessages } from "reactivexcomponent.js/lib/types";
import { CompositionModelState } from "reducers/compositionModel";

interface XCSpyGlobalProps extends XCSpyProps, XCSpyCallbackProps {
};

interface XCSpyProps {
  submitted: boolean;
  selectedApi: string;
  serverUrl: string;
  compositionModel: CompositionModelState;
};

interface XCSpyCallbackProps {
  setCompositionModel: (xcApiName: string, serverUrl: string) => void;
  initSession: (xcApiName: string, serverUrl: string, init: (xcApi: string, serverUrl: string) => Promise<any>) => void;
};

const XCSpyMainPage = (props: XCSpyGlobalProps) => {
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
  props.initSession(props.selectedApi, props.serverUrl, sessionXCSpy.init);
  const currentComponent = props.compositionModel.value.components[0].name;

  return (
    <Redirect to={{ pathname: routes.paths.app, search: `${routes.params.serverUrl}=${props.serverUrl}&${routes.params.api}=${props.selectedApi}&${routes.params.currentComponent}=${currentComponent}` }} />
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
    },
    initSession: (xcApiName: string, serverUrl: string, init: (xcApi: string, serverUrl: string) => Promise<any>): void => {
      dispatch(initSession(xcApiName, serverUrl, init));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(XCSpyMainPage);