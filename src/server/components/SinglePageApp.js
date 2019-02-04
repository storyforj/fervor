import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';

const SinglePageApp = ({
  Component,
  extra,
  serverClient,
  store,
}) => (
  <ApolloProvider client={serverClient}>
    <Provider store={store}>
      <React.Fragment>
        <Component />
        { extra }
      </React.Fragment>
    </Provider>
  </ApolloProvider>
);

SinglePageApp.defaultProps = {
  extra: null,
};
SinglePageApp.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,
  extra: PropTypes.node,
  serverClient: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

export default SinglePageApp;
