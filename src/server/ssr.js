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

const App = ({ ctx, routes, serverClient, store }) => (
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
  routes: PropTypes.object.isRequired,
  serverClient: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

export default (routes, appLocation, Doc = Document) => {
  const processRoute = async (ctx, next) => {
    const serverClient = new ApolloClient({
      ssrMode: true,
      networkInterface: createNetworkInterface({
        uri: `${process.env.HOST || ctx.request.origin}/graphql`,
      }),
    });
    const store = initStore({
      location: { pathname: ctx.req.url, search: '', hash: '' },
      session: {
        isAuthenticated: false, // ctx.isAuthenticated(),
        user: null, // ctx.state.user,
      },
    });

    const app = (
      <App
        ctx={ctx}
        routes={routes}
        store={store}
        serverClient={serverClient}
      />
    );

    return getDataFromTree(app).then(() => {
      const state = store.getState();
      state.apollo = serverClient.getInitialState();

      // TODO: app.props.title is not accessible on the server-side.
      // For now we'll just rely on it getting set client side.

      ctx.body = `<!doctype html>\n${ReactDOMServer.renderToStaticMarkup((
        <Doc
          appLocation={appLocation}
          content={ReactDOMServer.renderToString(app)}
          state={state}
          title={app.props.title}
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
