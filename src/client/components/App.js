import PropTypes from 'prop-types';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import cookie from 'cookies-js';
import lodashMerge from 'lodash.merge';
// eslint-disable-next-line
import fervorClientResolvers from 'fervorClientResolvers';
// eslint-disable-next-line
import fervorConfigRendering from 'fervorConfigRendering';

import browserHistory from '../history';
import store from '../store';

const cache = (new InMemoryCache({})).restore(window.APOLLO_STATE.apollo);

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

const stateLink = withClientState({
  ...lodashMerge(...fervorClientResolvers),
  cache,
});

const link = ApolloLink.from([stateLink, middlewareLink, httpLink]);
const webClient = new ApolloClient({
  cache,
  link,
});

class App extends React.PureComponent {
  static propTypes = {
    Routes: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
    ]).isRequired,
    locationPathName: PropTypes.string.isRequired,
    PageLoadComponent: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
    ]).isRequired,
  };
  render() {
    const { App: AppWrapper } = fervorConfigRendering.client;
    const Wrapper = AppWrapper || React.Fragment;
    const RoutesComponent = this.props.Routes;

    return (
      <Wrapper>
        <ApolloProvider client={webClient}>
          <Provider store={store}>
            <ConnectedRouter history={browserHistory}>
              <RoutesComponent initialPath={this.props.locationPathName} PageLoadComponent={this.props.PageLoadComponent} />
            </ConnectedRouter>
          </Provider>
        </ApolloProvider>
      </Wrapper>
    );
  }
}

export default App;