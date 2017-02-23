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
import Spy from "./components/Spy";

const middleware = applyMiddleware(thunk, logger());
const store = createStore(SpyReducer, middleware);

let App = (mapState) => {
  if (mapState.submitted)
    return (
      <Spy serverUrl={mapState.serverUrl} api={mapState.selectedApi}/>
    );
  return (
    <ConfigForm />
  );
};
const mapStateToProps = (state) => {
  return {
    submitted: state.configForm.formSubmited,
    selectedApi: state.configForm.selectedApi,
    serverUrl: state.configForm.serverUrl
  };
};
App = connect(mapStateToProps)(App);

ReactDOM.render(
  <Provider store={store} >
    <App />
  </Provider>,
  document.getElementById("app")
);
