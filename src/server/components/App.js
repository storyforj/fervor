import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import {
  Switch,
  Route,
} from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';

const GenericNotFound = () => (<div>Not Found</div>);

const App = ({
  ctx,
  routes,
  serverClient,
  store,
  statusComponents,
}) => (
  <ApolloProvider client={serverClient}>
    <Provider store={store}>
      <StaticRouter location={ctx.req.url} context={ctx}>
        <Switch>
          { Object.keys(routes).map((path) => (
            <Route
              key={path}
              path={path}
              component={routes[path]}
              exact
            />
          ))}
          <Route component={statusComponents.e404 || GenericNotFound} />
        </Switch>
      </StaticRouter>
    </Provider>
  </ApolloProvider>
);

App.propTypes = {
  ctx: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired,
  serverClient: PropTypes.object.isRequired,
  statusComponents: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

export default App;
