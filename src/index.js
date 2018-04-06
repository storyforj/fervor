import clientCookies from 'cookies-js';
import { compose, Query, Mutation, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { push, replace, go, goBack, goForward } from 'react-router-redux';

import Document from './client/components/Document';
import Form from './client/components/Form';

module.exports = {
  clientCookies,
  compose,
  connect,
  historyActions: {
    push,
    replace,
    go,
    goBack,
    goForward,
  },
  // NOTE: I don't like this function living here.
  // If it happens again let's find it a new home.
  gql: (str) => {
    const ast = gql(str);
    ast.query = str;
    return ast;
  },
  Query,
  Mutation,
  Link,
  graphql,
  PropTypes,
  React,

  Document,
  Form,
};
