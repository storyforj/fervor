import React from 'react';
import {
    Switch,
    Route,
} from 'react-router-dom';
// eslint-disable-next-line
import moleculeRoutes from 'moleculeAppRoutes';

const Routes = () => {
  const routes = Object.keys(moleculeRoutes).map((path) => (
    <Route
      exact
      key={path}
      path={path}
      component={moleculeRoutes[path]}
    />
  ));

  return (
    <Switch>
      {routes}
    </Switch>
  );
};

export default Routes;
