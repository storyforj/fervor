import { gql } from 'graphql-tag';

export default [{
  typeDefs: `
    type Counter {
      value: Int!
    }
    type Mutation {
      incrementCounter(): Counter
    }
    type Query {
      counter: Counter
    }
  `,
  defaults: {
    counter: {
      value: 0,
      __typename: 'Counter',
    },
  },
  resolvers: {
    Mutation: {
      incrementCounter: (_, _2, { cache }) => {
        const query = gql`
          query { counter @client {
            value
          }}
        `;

        const previous = cache.readQuery({ query });
        const counter = { value: previous.counter.value + 1, __typename: 'Counter' };
        const data = { counter };

        // you can also do cache.writeData({ data }) here if you prefer
        cache.writeQuery({ query, data });
        return counter;
      },
    },
  },
}];
