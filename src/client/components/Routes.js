import PropTypes from 'prop-types';
import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import pathToRegExp from 'path-to-regexp';
// eslint-disable-next-line
import fervorRoutes from 'fervorAppRoutes';

import Bundle from './Bundle';

const createLoaderHOC = (componentLoader, StatusComponents) => {
  const BundleLoader = (props) => (
    <Bundle componentLoader={componentLoader} StatusComponents={StatusComponents}>
      {(Component, loaderError) => (<Component {...props} loaderError={loaderError} />)}
    </Bundle>
  );

  return BundleLoader;
};

const GenericLoading = () => (null);
const GenericNotFound = () => (<div>Not Found</div>);
const GenericError = () => (<div>Error</div>);
const Routes = ({ initialPath, PageLoadComponent }) => {
  const routes = Object.keys(fervorRoutes).map((path) => (
    ['loading', 'e404', 'e500'].includes(path) ? null : <Route
      exact
      key={path}
      path={path}
      component={
        pathToRegExp(path).test(initialPath) ?
          PageLoadComponent.default || PageLoadComponent :
          createLoaderHOC(
            fervorRoutes[path],
            {
              loading: fervorRoutes.loading || GenericLoading,
              e404: fervorRoutes.e404 || GenericNotFound,
              e500: fervorRoutes.e500 || GenericError,
            },
          )
      }
    />
  ));

  return (
    <Switch>
      {routes}
      <Route component={routes.e404 ? fervorRoutes.e404 : GenericNotFound} />
    </Switch>
  );
};

Routes.propTypes = {
  initialPath: PropTypes.string.isRequired,
  PageLoadComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,
};

export default Routes;
