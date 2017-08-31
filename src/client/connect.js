import { graphql, compose } from 'react-apollo';

export default function connect(gql, Component) {
  return compose(graphql(gql))(Component);
}
