import "grommet/scss/hpe/index.scss";
import { Provider, connect } from "react-redux";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import * as App from "grommet/components/App";
import ConfigForm from "./components/ConfigForm";
import { SpyReducer } from "./reducers/SpyReducer";
import * as logger from "redux-logger";
import thunk from "redux-thunk";
import CompositionModel from "./components/CompositionModel";
import { setCompositionModel } from "actions/compositionModel";

const middleware = applyMiddleware(thunk, logger());
const store = createStore(SpyReducer, middleware);

let App = (props) => {
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
  return (
    <CompositionModel compositionModel={props.compositionModel.value} />
  );
};
const mapStateToProps = (state) => {
  return {
    submitted: state.configForm.formSubmited,
    selectedApi: state.configForm.selectedApi,
    serverUrl: state.configForm.serverUrl,
    compositionModel: state.compositionModel
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setCompositionModel: (xcApiName, serverUrl) => {
      dispatch(setCompositionModel(xcApiName, serverUrl));
    }
  };
};
App = connect(mapStateToProps, mapDispatchToProps)(App);

ReactDOM.render(
  <Provider store={store} >
    <App />
  </Provider>,
  document.getElementById("app")
);
