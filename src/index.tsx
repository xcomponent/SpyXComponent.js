import { Provider, connect } from "react-redux";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import * as App from "grommet/components/App";
import ConfigForm from "./components/ConfigForm";
import { XCSpyState, RootReducer } from "./reducers/spyReducer";
import * as logger from "redux-logger";
import thunk from "redux-thunk";
import Components from "./components/Components";
import { setCompositionModel } from "actions/compositionModel";
import { Dispatch } from "redux";
import { Parser } from "utils/parser";
import { subscribeAllStateMachines, snapshotEntryPoint } from "core";
import SideBar from "./components/SideBar";
import * as Split from "grommet/components/Split";
import * as Box from "grommet/components/Box";
import AppHeader from "./components/AppHeader";
import Footer from "./components/Footer";
import TransitionProperties from "./components/TransitionProperties";
import StateMachineProperties from "./components/StateMachineProperties";
import { BrowserRouter as Router, Route, Link, withRouter, Redirect } from "react-router-dom";
import XCSpyApp from "./components/XCSpyApp";
import XCSpyMainPage from "./components/XCSpyMainPage";
import { routes } from "./utils/routes";
import { IntlProvider } from "react-intl";
import { getLocalizedResources } from "./locales/localeConfiguration";
import { ComponentClass } from "react";
import registerServiceWorker from "./registerServiceWorker";

const middleware = applyMiddleware(thunk, logger.createLogger());
const store = createStore(RootReducer, middleware);
const locale = "en";

ReactDOM.render(
  <Provider store={store} >
    <IntlProvider locale={locale} messages={getLocalizedResources(locale)}>
      <Router>
        <div>
          <Route exact path={routes.paths.home} component={XCSpyMainPage} />
          <Route path={routes.paths.form} component={XCSpyMainPage} />
          <Route path={routes.paths.app} component={XCSpyApp as ComponentClass<any>} />
        </div>
      </Router>
    </IntlProvider>
  </Provider>,
  document.getElementById("app")
);
registerServiceWorker();