import React from 'react';
import { getDataFromTree } from 'react-apollo';
import { Helmet } from 'react-helmet';
import ReactDOMServer from 'react-dom/server';

import load from '../../shared/utils/load';
import requestStateBuilder from '../utils/requestStateBuilder';
import Document from '../components/Document';
import App from '../components/SinglePageApp';

const GenericError = () => (<div>Internal Server Error</div>);

async function renderError(options, ctx) {
  const { serverClient, store } = requestStateBuilder(options, ctx);

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

  /* eslint-disable react/no-danger */
  let app = (
    <App
      Component={options.routes.e500 ? options.routes.e500.default || options.routes.e500 : GenericError}
      store={store}
      serverClient={serverClient}
      extra={
        <script dangerouslySetInnerHTML={{
          __html: '(function() { window.fervor = window.fervor || {}; window.fervor.documentStatus = \'500\'; }())',
        }}
        />
      }
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

    return `<!doctype html>\n${ReactDOMServer.renderToStaticMarkup((
      <Document
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
  });
}

export default (options) => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    if (ctx.response.type === 'application/json') {
      ctx.body = { error: 'Internal Server Error' };
    } else {
      // try to render the 500 error, if its not possible fallback to the generic style app error
      try {
        ctx.body = await renderError(options, ctx);
      } catch (e) {
        ctx.body = 'Internal Server Error';
      }
    }
    ctx.app.emit('error', err, ctx);
  }
};
