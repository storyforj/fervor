import React from 'react';
import {
    ApolloClient,
    ApolloProvider,
    createNetworkInterface,
} from 'react-apollo';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { getUniversalState } from 'react-html-document';

import initStore from '../shared/store';
import Routes from './routes';

const store = initStore(getUniversalState());

const webClient = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: `${process.env.HOST}/graphql`,
  }),
});

const render = (Component) => {
  ReactDOM.render(
    (
      <ApolloProvider client={webClient} store={store}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </ApolloProvider>
    ),
    document.querySelectorAll('[data-reactroot]')[1],
  );
};

render(Routes);

if (module.hot) {
  // eslint-disable-next-line global-require
  module.hot.accept('./routes', () => render(require('./routes').default));
}
