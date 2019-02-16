import PropTypes from 'prop-types';
import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
// eslint-disable-next-line
import fervorRoutes from 'fervorAppRoutes';

import Bundle from './Bundle';

class BundleLoader extends React.PureComponent {
  render() {
    const { bundleConfig, ...otherProps } = this.props;
    const CachedComponent = bundleConfig.componentCache[bundleConfig.path];
    return (
      CachedComponent ? <CachedComponent {...otherProps} /> : (
        <Bundle {...bundleConfig}>
          {(Component, loaderError) => (<Component {...otherProps} loaderError={loaderError} />)}
        </Bundle>
      )
    );
  }
}

const GenericLoading = () => (null);
const GenericNotFound = () => (<div>Not Found</div>);
const GenericError = () => (<div>Error</div>);
class Routes extends React.PureComponent {
  static propTypes = {
    componentCache: PropTypes.object.isRequired,
  };

  render() {
    const { componentCache } = this.props;
    const routes = Object.keys(fervorRoutes).map((path) => {
      const options = { ...(typeof fervorRoutes[path] === 'object' ? fervorRoutes[path] : {}) };
      const bundleConfig = {
        componentCache,
        path,
        componentLoader: typeof fervorRoutes[path] === 'object' ? fervorRoutes[path].loader : fervorRoutes[path],
        StatusComponents: {
          loading: fervorRoutes.loading || GenericLoading,
          e404: fervorRoutes.e404 || GenericNotFound,
          e500: fervorRoutes.e500 || GenericError,
        },
      };

      return (
        ['loading', 'e404', 'e500'].includes(path) ? null : (
          <Route
            exact={typeof fervorRoutes[path] === 'object' && typeof fervorRoutes[path].exact === 'boolean' ? fervorRoutes[path].exact : true}
            key={path}
            path={path}
            render={(props) => <BundleLoader bundleConfig={bundleConfig} {...props} />}
            {...options}
          />
        )
      );
    });

    return (
      <Switch>
        {routes}
        <Route component={fervorRoutes.e404 ? fervorRoutes.e404.default || fervorRoutes.e404 : GenericNotFound} />
      </Switch>
    );
  }
}

export default Routes;
