import PropTypes from 'prop-types';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { setContext } from 'apollo-link-context';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import cookie from 'cookies-js';
import lodashMerge from 'lodash.mergewith';
import { createBrowserHistory } from 'history';
// eslint-disable-next-line
import fervorClientResolvers from 'fervorClientResolvers';
// eslint-disable-next-line
import fervorConfigRendering from 'fervorConfigRendering';

import initStore from '../../shared/store';

const browserHistory = createBrowserHistory();
const store = initStore(
  {},
  [routerMiddleware(browserHistory)],
  browserHistory,
);

const cache = (new InMemoryCache({})).restore(window.APOLLO_STATE.apollo);

const httpLink = createHttpLink({ uri: '/graphql' });
const location = window.location;
const wsLink = new WebSocketLink({
  uri: `ws${location.protocol === 'https:' ? 's' : ''}://${location.hostname}${
    location.port !== 80 && location.port !== 443 ? `:${location.port}` : ''
  }/graphql`,
  options: {
    reconnect: true,
  },
});
const protocolSelector = ({ query }) => {
  const definition = getMainDefinition(query);
  return (
    definition.kind === 'OperationDefinition' &&
    definition.operation === 'subscription'
  );
};
const connectionLink = split(protocolSelector, wsLink, httpLink);
const middlewareLink = setContext(() => {
  const authJWT = cookie.get('authJWT');
  if (!authJWT) { return undefined; }
  return {
    headers: {
      Authorization: `Bearer ${authJWT}`,
    },
  };
});

const { defaults, typeDefs, ...otherApolloSettings } = lodashMerge({}, ...fervorClientResolvers, (objValue, srcValue) => {
  if (objValue instanceof Array || typeof objValue === 'string') {
    return objValue.concat(srcValue);
  }
  return undefined;
});
const link = ApolloLink.from([middlewareLink, connectionLink]);
const webClient = new ApolloClient({
  cache,
  link,
  ...otherApolloSettings,
  typeDefs,
});
cache.writeData({ data: defaults || {} });

const appOptions = (
  fervorConfigRendering.client &&
  typeof fervorConfigRendering.client.getAppOptions === 'function'
) ? fervorConfigRendering.client.getAppOptions() : {};

class App extends React.PureComponent {
  static propTypes = {
    Routes: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
    ]).isRequired,
    componentCache: PropTypes.object.isRequired,
  };
  render() {
    const { App: AppWrapper } = fervorConfigRendering.client;
    const RoutesComponent = this.props.Routes;

    if (AppWrapper) {
      return (
        <AppWrapper appOptions={appOptions}>
          <ApolloProvider client={webClient}>
            <Provider store={store}>
              <ConnectedRouter history={browserHistory}>
                <RoutesComponent componentCache={this.props.componentCache} />
              </ConnectedRouter>
            </Provider>
          </ApolloProvider>
        </AppWrapper>
      );
    }

    return (
      <React.Fragment>
        <ApolloProvider client={webClient}>
          <Provider store={store}>
            <ConnectedRouter history={browserHistory}>
              <RoutesComponent componentCache={this.props.componentCache} />
            </ConnectedRouter>
          </Provider>
        </ApolloProvider>
      </React.Fragment>
    );
  }
}

export default App;
