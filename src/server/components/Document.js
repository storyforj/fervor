import PropTypes from 'prop-types';
import React from 'react';

/* eslint-disable react/no-danger */
export default function Document({
  appFavicon,
  appIcons,
  appLocation,
  appThemeColor,
  content,
  state,
  title,
}) {
  let scripts = <script src="/build/bundle.js" />;
  let cssFiles = null;

  if (process.env.NODE_ENV.indexOf('prod') > -1) {
    // requiring the manfiest happens on the server side and only in prod
    // this means a dynamic require is fine
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const manifestJSON = require(`${appLocation}/build/manifest.json`);

    cssFiles = Object.keys(manifestJSON.cssChunks).map((cssFile) => (
      <link key={cssFile} rel="stylesheet" type="text/css" href={`/build/${cssFile}`} />
    ));
    scripts = Object.keys(manifestJSON.jsChunks).map((jsFile) => (
      <script async defer src={`/build/${jsFile}`} />
    ));
    scripts.unshift(
      <script
        dangerouslySetInnerHTML={{
          __html: 'if ("serviceWorker" in navigator) {navigator.serviceWorker.register("/sw.js") }',
        }}
      />,
    );
  }

  const pwaMeta = [];
  if (appIcons.length) {
    Object.keys(appIcons).forEach((icon) => {
      pwaMeta.push(
        <link
          href={icon.src}
          key={icon.src}
          rel="apple-touch-icon-precomposed"
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
  if (appThemeColor) {
    pwaMeta.push(<meta key="appThemeColor" name="theme-color" content={appThemeColor} />);
  }

  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        { pwaMeta }
        <link rel="manifest" href="/pwamanifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        { cssFiles }
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: content }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.APOLLO_STATE=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
          }}
        />
        { scripts }
      </body>
    </html>
  );
}

Document.defaultProps = {
  appIcons: [],
  appFavicon: null,
  title: '',
};

Document.propTypes = {
  appLocation: PropTypes.string.isRequired,
  appIcons: PropTypes.array,
  appFavicon: PropTypes.string,
  appThemeColor: PropTypes.string,
  content: PropTypes.string.isRequired,
  state: PropTypes.object.isRequired,
  title: PropTypes.string,
};
