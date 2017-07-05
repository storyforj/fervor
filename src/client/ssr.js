import KoaRouter from 'koa-router';
import PropTypes from 'prop-types';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import {
  matchPath,
  Switch,
  Route,
} from 'react-router-dom';

import initStore from './store';
import Document from './components/Document';
import { createEnvironment } from './network';

class EnvironmentContext extends React.Component {
  getChildContext() {
    return { environment: this.props.environment };
  }
  render() {
    return <div>{ this.props.children }</div>;
  }
}
EnvironmentContext.childContextTypes = {
  environment: PropTypes.object,
};
EnvironmentContext.defaultProps = {
  environment: null,
};
EnvironmentContext.propTypes = {
  environment: PropTypes.object,
  children: PropTypes.element.isRequired,
};

export default (routes, Doc = Document) => {
  const App = ({ ctx }) => (
    <StaticRouter location={ctx.req.url} context={ctx}>
      <Switch>
        { routes.map((route) => (
          <Route key={route.path} path={route.path} component={route.component()} />
        ))}
      </Switch>
    </StaticRouter>
  );

  App.propTypes = {
    ctx: PropTypes.object.isRequired,
  };

  const processRoute = async (ctx) => {
    let rootQuery = '';
    let variables = {};
    routes.some((route) => {
      const match = matchPath(ctx.req.url, route);
      if (match) {
        rootQuery = route.query;
        if (route.getVars) {
          variables = route.getVars(match);
        }
      }
      return match;
    });

    let environment;
    if (rootQuery) {
      environment = await createEnvironment(rootQuery, variables);
    }

    const store = initStore({
      location: { pathname: ctx.req.url, search: '', hash: '' },
      session: {
        isAuthenticated: false, // ctx.isAuthenticated(),
        user: null, // ctx.state.user,
      },
    });

    ctx.body = renderToString(
      (
        <Doc title={'Test'} state={store.getState()}>
          { /* <EnvironmentContext environment={environment}> */ }
          <App ctx={ctx} state={store.getState()} />
          { /* </EnvironmentContext> */ }
        </Doc>
      ),
    );
  };

  const router = new KoaRouter();
  routes.forEach((route) => {
    router.get(route.path, processRoute);
  });

  return router.routes();
};
