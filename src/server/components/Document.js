import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';

/* eslint-disable react/no-danger */
export default function Document({
  appFavicon,
  appLocation,
  content,
  helmet,
  manifest,
  state,
  title,
  additionalContent,
  processMeta,
  processCSS,
  processJS,
}) {
  let scripts = [
    <script key="bundle.js" src="/build/bundle.js" />,
  ];
  let cssFiles = [];

  if (process.env.NODE_ENV.indexOf('prod') > -1) {
    // requiring the manfiest happens on the server side and only in prod
    // this means a dynamic require is fine
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const manifestJSON = require(`${appLocation}/build/manifest.json`);

    cssFiles = Object.keys(manifestJSON.cssChunks).map((cssFile) => (
      <link key={`/build/${cssFile}`} rel="stylesheet" type="text/css" href={`/build/${cssFile}`} />
    ));
    scripts = Object.keys(manifestJSON.jsChunks).reverse().map((jsFile) => (
      (jsFile.indexOf('bundle') > -1 || jsFile.indexOf('common') > -1) ?
        <script key={`/build/${jsFile}`} async defer src={`/build/${jsFile}`} /> :
        null
    )).filter((value) => value !== null);
    scripts.unshift(
      <script
        dangerouslySetInnerHTML={{
          __html: 'if ("serviceWorker" in navigator) {navigator.serviceWorker.register("/sw.js") }',
        }}
      />,
    );
  }

  const pwaMeta = [];
  if (manifest.icons.length) {
    Object.keys(manifest.icons).forEach((key) => {
      const icon = manifest.icons[key];
      pwaMeta.push(
        <link
          href={icon.src}
          key={`appAppleIcon${icon.size}`}
          rel="apple-touch-icon-precomposed"
          sizes={icon.size}
        />,
      );
      pwaMeta.push(
        <link
          href={icon.src}
          key={`appIcon${icon.size}`}
          rel="icon"
          sizes={icon.size}
        />,
      );
    });
  }
  if (appFavicon) {
    pwaMeta.push(
      <link key="appFavicon" rel="shortcut icon" href={appFavicon} />,
    );
  }
  if (manifest.theme_color) {
    pwaMeta.push(<meta key="appThemeColor" name="theme-color" content={manifest.theme_color} />);
  }

  const htmlAttrs = helmet.htmlAttributes.toComponent();
  const bodyAttrs = helmet.bodyAttributes.toComponent();

  return (
    <html lang="en" {...htmlAttrs}>
      <head>
        {title ? <title>{title}</title> : null}
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        { processMeta(pwaMeta.concat([
          <link key="appManifest" rel="manifest" href="/appmanifest.json" />,
        ]))}
        {helmet.link.toComponent()}
        { processCSS(cssFiles) }
        {helmet.style.toComponent()}
        {helmet.script.toComponent()}
        {helmet.noscript.toComponent()}
      </head>
      <body {...bodyAttrs}>
        <div id="app" dangerouslySetInnerHTML={{ __html: content }} />
        { additionalContent }
        <script
          dangerouslySetInnerHTML={{
            __html: `window.APOLLO_STATE=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
          }}
        />
        { processJS(scripts) }
      </body>
    </html>
  );
}

Document.defaultProps = {
  appFavicon: null,
  manifest: {},
  title: '',
  additionalContent: null,
  processMeta: (tags) => tags,
  processCSS: (tags) => tags,
  processJS: (tags) => tags,
};

Document.propTypes = {
  appLocation: PropTypes.string.isRequired,
  appFavicon: PropTypes.string,
  manifest: PropTypes.object,
  content: PropTypes.string.isRequired,
  helmet: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  title: PropTypes.string,
  additionalContent: PropTypes.node,
  processMeta: PropTypes.func,
  processCSS: PropTypes.func,
  processJS: PropTypes.func,
};
