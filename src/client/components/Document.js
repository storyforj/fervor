import PropTypes from 'prop-types';
import React from 'react';
import HTMLDocument from 'react-html-document';

// let cssFiles = ['/build/bundle.css'];
const jsFiles = ['/build/bundle.js'];

/* stylesheets={cssFiles} */
export default function Document(props) {
  return (
    <HTMLDocument
      title={props.title}
      metatags={[
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ]}
      universalState={props.state}
      scripts={jsFiles}
    >
      {props.children}
    </HTMLDocument>
  );
}

Document.defaultProps = {
  state: {},
};

Document.propTypes = {
  children: PropTypes.element.isRequired,
  state: React.PropTypes.object,
  title: PropTypes.string.isRequired,
};
