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
    App,
  },
  client: {
    App,
  },
};
