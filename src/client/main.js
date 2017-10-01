import cookie from 'cookies-js';
import React from 'react';
import {
    ApolloClient,
    ApolloProvider,
    createNetworkInterface,
} from 'react-apollo';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';

import initStore from '../shared/store';
import Routes from './routes';

const browserHistory = createBrowserHistory();
const pathname = `${document.location.pathname}${document.location.search}`;
browserHistory.push(`${document.location.pathname}${document.location.search}`);
const store = initStore(
  { router: { location: { pathname } } },
  [
    routerMiddleware(browserHistory),
  ],
);

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


const render = (Component) => {
  ReactDOM.hydrate(
    (
      <ApolloProvider client={webClient} store={store}>
        <ConnectedRouter history={browserHistory}>
          <Component />
        </ConnectedRouter>
      </ApolloProvider>
    ),
    document.querySelector('#app'),
  );
};

render(Routes);

if (module.hot) {
  // eslint-disable-next-line global-require
  module.hot.accept('./routes', () => render(require('./routes').default));
}
