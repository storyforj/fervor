import React from 'react';
import { getDataFromTree } from 'react-apollo';
import { Helmet } from 'react-helmet';
import ReactDOMServer from 'react-dom/server';

import load from '../shared/utils/load';
import resolveRoutes from './utils/resolveRoutes';
import requestStateBuilder from './utils/requestStateBuilder';
import Document from './components/Document';
import App from './components/App';

const GenericLoading = () => (null);
const GenericNotFound = () => (<div>Not Found</div>);
const GenericError = () => (<div>Error</div>);

export default async (options, ctx, next, Doc = Document) => {
  const { serverClient, store } = requestStateBuilder(options, ctx);
  const routes = await resolveRoutes(options);

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

  const renderApp = () => (
    <App
      ctx={ctx}
      routes={routes}
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

  let app = renderApp();
  const AppWraperComponent = AppWrapper || React.Fragment;
  if (AppWrapper) {
    app = (
      <AppWraperComponent options={appOptions} disableStylesGeneration>{app}</AppWraperComponent>
    );
  }

  return getDataFromTree(app).then(() => {
    const state = store.getState();
    state.apollo = serverClient.extract();
    const content = ReactDOMServer.renderToString(
      <AppWraperComponent options={appOptions}>
        {renderApp()}
      </AppWraperComponent>,
    );
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
