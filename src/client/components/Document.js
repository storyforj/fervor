import PropTypes from 'prop-types';
import React from 'react';

export default class Document extends React.Component {

  componentDidMount() {
    document.querySelector('title').innerText = this.props.title;
  }

  render() {
    return this.props.children;
  }
}

Document.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};
