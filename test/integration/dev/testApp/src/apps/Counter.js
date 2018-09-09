import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

const counterQuery = gql`
query {
  counter @client {
    value
  }
}
`;

const counterMutation = gql`
mutation IncrementCounter {
  incrementCounter @client {
    counter @client {
      value
    }
  }
}`;

export default () => (
  <Query query={counterQuery}>
    {({ data }) => (
      <React.Fragment>
        <Mutation mutation={counterMutation}>
          {(mutate) => (
            <React.Fragment>
              <span className="counter-text">{data.counter.value}</span>
              <button className="counter-button" onClick={mutate}>Counter</button>
            </React.Fragment>
          )}
        </Mutation>
      </React.Fragment>
    )}
  </Query>
);
