import cookie from 'cookies-js';
import pathToRegExp from 'path-to-regexp';
import React from 'react';
import {
    ApolloClient,
    ApolloProvider,
    createNetworkInterface,
} from 'react-apollo';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
// eslint-disable-next-line
import fervorRoutes from 'fervorAppRoutes';
// eslint-disable-next-line
import fervorConfigRendering from 'fervorConfigRendering';

import browserHistory from './history';
import store from './store';
import Routes from './routes';

const networkInterface = createNetworkInterface({ uri: '/graphql' });
networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) { req.options.headers = {}; }

    const authJWT = cookie.get('authJWT');
    if (authJWT) {
      req.options.headers.Authorization = `Bearer ${authJWT}`;
    }

    next();
  },
}]);
const webClient = new ApolloClient({
  initialState: { apollo: window.APOLLO_STATE.apollo },
  networkInterface,
});

const render = (Component, initialPath, startingComponent) => {
  let app = (
    <ApolloProvider client={webClient} store={store}>
      <ConnectedRouter history={browserHistory}>
        <Component initialPath={initialPath} startingComponent={startingComponent} />
      </ConnectedRouter>
    </ApolloProvider>
  );

  const { App: AppWrapper } = rendering.default.client;
  if (AppWrapper) {
    app = <AppWrapper>{app}</AppWrapper>;
  }

  ReactDOM.hydrate(app, document.querySelector('#app'));
};

let startApp = () => render(Routes);
// let's find the path and pre-load the JS file before we render the system.
// Without this hydration ends up failing since there is an in-between
// state where an empty div is rendered
// eslint-disable-next-line
for (const path of Object.keys(fervorRoutes)) {
  if (pathToRegExp(path).test(location.pathname)) {
    startApp = () => fervorRoutes[path]((mod) => render(
      Routes,
      location.pathname,
      mod.default,
    ));
    break;
  }
}
startApp();

if (module.hot) {
  module.hot.accept();
}
