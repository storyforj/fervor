import PropTypes from 'prop-types';
import React from 'react';
import lodashMerge from 'lodash.merge';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
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

import initStore from '../shared/store';
import load from '../shared/utils/load';
import Document from './components/Document';

const GenericNotFound = () => (<div>Not Found</div>);

const App = ({
  ctx,
  routes,
  serverClient,
  store,
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
          <Route component={routes['404'] || GenericNotFound} />
        </Switch>
      </StaticRouter>
    </Provider>
  </ApolloProvider>
);

App.propTypes = {
  ctx: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired,
  serverClient: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

export default async (options, ctx, next, Doc = Document) => {
  const cache = new InMemoryCache({});
  const httpLink = createHttpLink({ uri: `${process.env.HOST || ctx.request.origin}/graphql` });
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
      headers: {
        Authorization: `Bearer ${ctx.cookie.authJWT}`,
      },
    };
  });

  const link = ApolloLink.from([clientStateLink, middlewareLink, httpLink]);
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
