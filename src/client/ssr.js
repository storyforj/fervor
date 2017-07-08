import KoaRouter from 'koa-router';
import PropTypes from 'prop-types';
import React from 'react';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import {
  Switch,
  Route,
} from 'react-router-dom';

import initStore from './store';
import Document from './components/Document';
import serverClient from './network';

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

  const processRoute = async (ctx, next) => {
    const store = initStore({
      location: { pathname: ctx.req.url, search: '', hash: '' },
      session: {
        isAuthenticated: false, // ctx.isAuthenticated(),
        user: null, // ctx.state.user,
      },
    });

    const app = (
      <ApolloProvider client={serverClient} store={store}>
        <App ctx={ctx} state={store.getState()} />
      </ApolloProvider>
    );

    return getDataFromTree(app).then(() => {
      ctx.body = ReactDOMServer.renderToString((
        <Doc title={'Test'} state={store.getState()}>
          { app }
        </Doc>
      ));
      next();
    });
  };

  const router = new KoaRouter();
  routes.forEach((route) => {
    router.get(route.path, processRoute);
  });

  return router.routes();
};
