import React from 'react';
import {
    Switch,
    Route,
} from 'react-router-dom';
// eslint-disable-next-line
import moleculeRoutes from 'moleculeAppRoutes';

const Routes = () => {
  const routes = moleculeRoutes.map((route) => (
    <Route
      exact
      key={route.path}
      path={route.path}
      component={route.component()}
    />
  ));

  return (
    <Switch>
      {routes}
    </Switch>
  );
};

export default Routes;
