import PropTypes from 'prop-types';
import React from 'react';

/* eslint-disable react/no-danger */
export default function Document({ content, state, title }) {
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" type="text/css" href="/build/bundle.css" />
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: content }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.APOLLO_STATE=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
          }}
        />
        <script src="/build/bundle.js" />
      </body>
    </html>
  );
}

Document.propTypes = {
  content: React.PropTypes.string.isRequired,
  state: React.PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};
