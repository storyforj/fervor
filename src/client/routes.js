import React from 'react';
import {
    Switch,
    Route,
} from 'react-router-dom';
// eslint-disable-next-line
import fervorRoutes from 'fervorAppRoutes';

const Routes = () => {
  const routes = Object.keys(fervorRoutes).map((path) => (
    <Route
      exact
      key={path}
      path={path}
      component={fervorRoutes[path]}
    />
  ));

  return (
    <Switch>
      {routes}
    </Switch>
  );
};

export default Routes;
