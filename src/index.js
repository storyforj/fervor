import clientCookies from 'cookies-js';
import { compose, gql as apolloGQL, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Document from './client/components/Document';
import Form from './client/components/Form';

module.exports = {
  clientCookies,
  compose,
  connect,
  // NOTE: I don't like this function living here.
  // If it happens again let's find it a new home.
  gql: (str) => {
    const ast = apolloGQL(str);
    ast.query = str;
    return ast;
  },
  graphql,
  Link,
  PropTypes,
  React,

  Document,
  Form,
};
