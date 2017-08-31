/* eslint-disable global-require */
module.exports = {
  gql: require('react-apollo').gql,
  Link: require('react-router-dom').Link,
  PropTypes: require('prop-types'),
  React: require('react'),

  connect: require('./lib/client/connect').default,
  Document: require('./lib/client/components/Document').default,
  Form: require('./lib/client/components/Form').default,
};
