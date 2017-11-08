import { Provider, connect } from "react-redux";
import * as React from "react";
import ConfigForm from "./ConfigForm";
import Components from "./Components";
import { setCompositionModel } from "../actions/compositionModel";
import sessionXCSpy from "../utils/sessionXCSpy";
import { Dispatch } from "redux";
import { Parser } from "../utils/parser";
import { BrowserRouter as Router, Route, Link, withRouter, Redirect } from "react-router-dom";
import { routes } from "../utils/routes";
import { XCSpyState } from "reducers/spyReducer";
import { initSession, setServerUrl } from "../actions";
import { xcMessages } from "reactivexcomponent.js/lib/types";
import { CompositionModelState } from "../reducers/compositionModel";

interface XCSpyGlobalProps extends XCSpyProps, XCSpyCallbackProps {
};

interface XCSpyProps {
  submitted: boolean;
  selectedApi: string;
  serverUrl: string;
  serverUrlParams: string;
  compositionModel: CompositionModelState;
};

interface XCSpyCallbackProps {
  setCompositionModel: (xcApiName: string, serverUrl: string) => void;
  initSession: (xcApiName: string, serverUrl: string, init: (xcApi: string, serverUrl: string) => Promise<any>) => void;
  onSetServerUrl: (serverUrl: string) => void;
};

class XCSpyMainPage extends React.Component<XCSpyGlobalProps, XCSpyState> {

  componentDidMount() {

    if (this.props.serverUrlParams) {
      this.props.onSetServerUrl(this.props.serverUrlParams);
    }
  }

  componentDidUpdate() {
    const props = this.props;
    if (props.submitted && !props.compositionModel.initialized) {
      props.setCompositionModel(props.selectedApi, props.serverUrl);
    }
    if (props.compositionModel.initialized) {
      props.initSession(props.selectedApi, props.serverUrl, sessionXCSpy.init);
    }
  }
  render() {
    const props = this.props;
    if (!props.submitted || (props.submitted && !props.compositionModel.initialized)) {
      return (
        <ConfigForm />
      );
    }
    const currentComponent = props.compositionModel.value.components[0].name;
    return (
      <Redirect to={{ pathname: routes.paths.app, search: `${routes.params.serverUrl}=${props.serverUrl}&${routes.params.api}=${props.selectedApi}&${routes.params.currentComponent}=${currentComponent}` }} />
    );
  }

}

const mapStateToProps = (state: XCSpyState, ownProps): XCSpyProps => {
  const urlSearchParams = new URLSearchParams(ownProps.location.search);
  const serverUrlParams = urlSearchParams.get(routes.params.serverUrl);
  return {
    submitted: state.configForm.formSubmited,
    selectedApi: state.configForm.selectedApi,
    serverUrl: state.configForm.serverUrl,
    serverUrlParams: serverUrlParams,
    compositionModel: state.compositionModel
  };
};

const mapDispatchToProps = (dispatch: Dispatch<XCSpyState>): XCSpyCallbackProps => {
  return {
    setCompositionModel: (xcApiName: string, serverUrl: string) => {
      dispatch(setCompositionModel(xcApiName, serverUrl));
    },
    initSession: (xcApiName: string, serverUrl: string, init: (xcApi: string, serverUrl: string) => Promise<any>): void => {
      dispatch(initSession(xcApiName, serverUrl, init));
    },
    onSetServerUrl: (serverUrl: string) => {
      dispatch(setServerUrl(serverUrl));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(XCSpyMainPage);