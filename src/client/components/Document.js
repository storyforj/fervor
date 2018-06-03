import PropTypes from 'prop-types';
import React from 'react';

export default class Document extends React.Component {

  componentDidMount() {
    // eslint-disable-next-line
    console.warn('The Document component in Fervor is now deprecated and will be removed in the future. Please use `Meta` instead. See https://github.com/fervorous/fervor/blob/master/CHANGELOG.md#110---2018-06-02 for more details.');
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
