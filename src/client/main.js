import cookie from 'cookies-js';
import pathToRegExp from 'path-to-regexp';
import React from 'react';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
// eslint-disable-next-line
import fervorRoutes from 'fervorAppRoutes';
// eslint-disable-next-line
import fervorConfigRendering from 'fervorConfigRendering';

import browserHistory from './history';
import store from './store';
import Routes from './routes';

const httpLink = createHttpLink({ uri: '/graphql' });
const middlewareLink = setContext(() => {
  const authJWT = cookie.get('authJWT');
  if (!authJWT) { return undefined; }
  return {
    headers: {
      Authorization: `Bearer ${authJWT}`,
    },
  };
});

const link = middlewareLink.concat(httpLink);
const cache = new InMemoryCache({});
const webClient = new ApolloClient({
  cache: cache.restore(window.APOLLO_STATE.apollo),
  link,
});

const render = (Component, initialPath, startingComponent) => {
  let app = (
    <ApolloProvider client={webClient}>
      <Provider store={store}>
        <ConnectedRouter history={browserHistory}>
          <Component initialPath={initialPath} startingComponent={startingComponent} />
        </ConnectedRouter>
      </Provider>
    </ApolloProvider>
  );

  const { App: AppWrapper } = fervorConfigRendering.client;
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
