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
import load from '../shared/utils/load';
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

export default (options, Doc = Document) => {
  const processRoute = async (ctx, next) => {
    const networkInterface = createNetworkInterface({
      uri: `${process.env.HOST || ctx.request.origin}/graphql`,
    });
    networkInterface.use([{
      applyMiddleware(req, nextNIMiddleware) {
        if (!req.options.headers) { req.options.headers = {}; }

        if (ctx.cookie && ctx.cookie.authJWT) {
          req.options.headers.Authorization = `Bearer ${ctx.cookie.authJWT}`;
        }

        nextNIMiddleware();
      },
    }]);
    const serverClient = new ApolloClient({
      ssrMode: true,
      networkInterface,
    });
    const store = initStore({ router: { location: { pathname: ctx.req.url } } });

    const rendering = load('config/rendering', {
      options,
      default: {
        default: {
          server: {
            getAppOptions: undefined,
            App: undefined,
            getAdditionalDocumentContent: undefined,
          },
        },
      },
    });

    let app = (
      <App
        ctx={ctx}
        routes={options.routes}
        store={store}
        serverClient={serverClient}
      />
    );

    const {
      getAppOptions,
      App: AppWrapper,
      getAdditionalDocumentContent,
    } = rendering.default.server;

    let appOptions = {};
    if (getAppOptions) {
      appOptions = getAppOptions();
    }

    if (AppWrapper) {
      app = <AppWrapper options={appOptions}>{app}</AppWrapper>;
    }

    return getDataFromTree(app).then(() => {
      const state = store.getState();
      state.apollo = serverClient.getInitialState();
      const content = ReactDOMServer.renderToString(app);

      // Load additional document content after rendering the app.
      // We do this after rendering the app to support hooks compiling
      // the necessary styles to render the app.
      let additionalDocumentContent;
      if (getAdditionalDocumentContent) {
        additionalDocumentContent = getAdditionalDocumentContent(appOptions);
      }

      // TODO: app.props.title is not accessible on the server-side.
      // For now we'll just rely on it getting set client side.

      ctx.body = `<!doctype html>\n${ReactDOMServer.renderToStaticMarkup((
        <Doc
          appLocation={options.appLocation}
          appFavicon={options.appFavicon}
          // eslint-disable-next-line
          manifest={require(`${options.appLocation}/src/config/appmanifest.json`)}
          content={content}
          state={state}
          title={app.props.title}
          additionalContent={additionalDocumentContent}
        />
      ))}`;

      next();
    });
  };

  const router = new KoaRouter();
  Object.keys(options.routes).forEach((path) => {
    router.get(path, processRoute);
  });

  return router.routes();
};
