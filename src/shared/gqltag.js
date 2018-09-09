import gql from 'graphql-tag';

// Our form component makes use out of the original query being accessible
// This small shim just adds a 'query' property to the parsed gql.
export default (str) => {
  const ast = gql(str);
  ast.query = str[0] ? str[0] : str;
  return ast;
};
