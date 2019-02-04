import PropTypes from 'prop-types';
import React from 'react';
import lodashMerge from 'lodash.merge';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import {
  Switch,
  Route,
} from 'react-router-dom';

import createPostgraphileLink from './graphql/apolloPostgraphileLink';
import initStore from '../shared/store';
import load from '../shared/utils/load';
import Document from './components/Document';

const GenericLoading = () => (null);
const GenericNotFound = () => (<div>Not Found</div>);
const GenericError = () => (<div>Error</div>);

const App = ({
  ctx,
  routes,
  serverClient,
  store,
  statusComponents,
}) => (
  <ApolloProvider client={serverClient}>
    <Provider store={store}>
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
          <Route component={statusComponents.e404 || GenericNotFound} />
        </Switch>
      </StaticRouter>
    </Provider>
  </ApolloProvider>
);

App.propTypes = {
  ctx: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired,
  serverClient: PropTypes.object.isRequired,
  statusComponents: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

export default async (options, ctx, next, Doc = Document) => {
  const cache = new InMemoryCache({});
  const schemaLink = createPostgraphileLink();
  let clientResolvers = load('graph/client', {
    options,
    default: [{ // load accepts a "default" to fallback to
      defaults: {}, // the default state
      resolvers: {},
    }],
  });

  // normalizing for es6 import purposes
  clientResolvers = clientResolvers.default ? clientResolvers.default : clientResolvers;

  const clientStateLink = withClientState({
    ...lodashMerge(...clientResolvers),
    cache,
  });
  const middlewareLink = setContext(() => {
    if (!ctx.cookie || !ctx.cookie.authJWT) { return undefined; }

    return {
      authorization: {
        jwtToken: ctx.cookie.authJWT,
      },
    };
  });

  const link = ApolloLink.from([clientStateLink, middlewareLink, schemaLink]);
  const serverClient = new ApolloClient({
    ssrMode: true,
    cache,
    link,
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

  const routePromises = Object.keys(options.routes).map(async (path) => {
    if (['e404', 'e500', 'loading'].includes(path)) {
      return { path, Component: options.routes[path] };
    }
    const module = await options.routes[path]();
    return { path, Component: module.default || module };
  });
  const resolvedRoutes = await Promise.all(routePromises);
  const resolvedRouteMap = resolvedRoutes.reduce((routeMap, route) => {
    if (!['e404', 'e500', 'loading'].includes(route.path)) {
      routeMap[route.path] = route.Component;
    }
    return routeMap;
  }, {});

  let app = (
    <App
      ctx={ctx}
      routes={resolvedRouteMap}
      store={store}
      serverClient={serverClient}
      statusComponents={{
        e404: options.routes.e404 || GenericNotFound,
        e500: options.routes.e500 || GenericError,
        loading: options.routes.loading || GenericLoading,
      }}
    />
  );

  const {
    getAppOptions,
    App: AppWrapper,
    getAdditionalDocumentContent,
    getDocumentHeadEndContent,
    processJS,
    processCSS,
    processMeta,
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
    state.apollo = serverClient.extract();
    const content = ReactDOMServer.renderToString(app);
    const helmet = Helmet.renderStatic();

    // Load additional document content after rendering the app.
    // We do this after rendering the app to support hooks compiling
    // the necessary styles to render the app.
    let additionalDocumentContent;
    if (getAdditionalDocumentContent) {
      additionalDocumentContent = getAdditionalDocumentContent(appOptions);
    }
    let documentHeadEndContent;
    if (getDocumentHeadEndContent) {
      documentHeadEndContent = getDocumentHeadEndContent(appOptions);
    }

    ctx.body = `<!doctype html>\n${ReactDOMServer.renderToStaticMarkup((
      <Doc
        appLocation={options.appLocation}
        appFavicon={options.appFavicon}
        // eslint-disable-next-line
        manifest={require(`${options.appLocation}/src/config/appmanifest.json`)}
        content={content}
        helmet={helmet}
        state={state}
        title={app.props.title}
        disableClient={options.disableClient}
        additionalContent={additionalDocumentContent}
        documentHeadEndContent={documentHeadEndContent}
        processMeta={processMeta}
        processCSS={processCSS}
        processJS={processJS}
        webpackWatcherDisabled={options.disableWebpack}
      />
    ))}`;

    next();
  });
};
