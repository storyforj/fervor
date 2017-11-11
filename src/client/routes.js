import PropTypes from 'prop-types';
import React from 'react';
import {
    Switch,
    Route,
} from 'react-router-dom';
// eslint-disable-next-line
import fervorRoutes from 'fervorAppRoutes';

import Bundle from './components/Bundle';

const loader = (componentLoader, initialPath, startingComponent) => {
  const BundleLoader = (props) => (
    <Bundle load={componentLoader} initialPath={initialPath} startingComponent={startingComponent}>
      {(Component) => (<Component {...props} />)}
    </Bundle>
  );

  return BundleLoader;
};

const Routes = ({ initialPath, startingComponent }) => {
  const routes = Object.keys(fervorRoutes).map((path) => (
    <Route
      exact
      key={path}
      path={path}
      component={loader(fervorRoutes[path], initialPath, startingComponent)}
    />
  ));

  return (
    <Switch>
      {routes}
    </Switch>
  );
};

Routes.propTypes = {
  initialPath: PropTypes.string.isRequired,
  startingComponent: PropTypes.func.isRequired,
};

export default Routes;

if (module.hot) {
  module.hot.accept();
}
