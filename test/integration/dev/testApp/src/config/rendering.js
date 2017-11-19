import React from 'react';
import PropTypes from 'prop-types';

const App = ({ children }) => (
  <div>
    Test Wrapper
    {children}
  </div>
);

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default {
  server: {
    getAdditionalDocumentContent: () => (
      <span style={{ display: 'none' }}>Additional Content</span>
    ),
    processCSS: (tags) => (
      [
        <link key="hello-css" name="hello-css" />,
      ].concat(tags)
    ),
    processJS: (tags) => (
      [
        <script key="hello-js" name="hello-js" />,
      ].concat(tags)
    ),
    processMeta: (tags) => (
      [
        <meta key="hello-js" name="hello-meta" />,
      ].concat(tags)
    ),
    App,
  },
  client: {
    App,
  },
};
