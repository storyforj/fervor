import KoaRouter from 'koa-router';
import PropTypes from 'prop-types';
import React from 'react';
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
  getDataFromTree,
} from 'react-apollo';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import {
  Switch,
  Route,
} from 'react-router-dom';

import initStore from '../shared/store';
import Document from './components/Document';

let serverClient;

export default (routes, Doc = Document) => {
  serverClient = new ApolloClient({
    ssrMode: true,
    networkInterface: createNetworkInterface({
      uri: `${process.env.HOST}/graphql`,
    }),
  });

  const App = ({ ctx, store }) => (
    <ApolloProvider client={serverClient} store={store}>
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
        </Switch>
      </StaticRouter>
    </ApolloProvider>
  );

  App.propTypes = {
    ctx: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  };

  const processRoute = async (ctx, next) => {
    const store = initStore({
      location: { pathname: ctx.req.url, search: '', hash: '' },
      session: {
        isAuthenticated: false, // ctx.isAuthenticated(),
        user: null, // ctx.state.user,
      },
    });

    const app = <App ctx={ctx} store={store} />;

    return getDataFromTree(app).then(() => {
      const state = store.getState();
      state.apollo = serverClient.getInitialState();

      ctx.body = `<!doctype html>\n${ReactDOMServer.renderToStaticMarkup((
        <Doc
          content={ReactDOMServer.renderToString(app)}
          state={state}
          title={'Test'}
        />
      ))}`;

      next();
    });
  };

  const router = new KoaRouter();
  Object.keys(routes).forEach((path) => {
    router.get(path, processRoute);
  });

  return router.routes();
};
