import gql from 'graphql-tag';

const getCounterQuery = gql`query GetCounter { counter @client { value } }`;

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
        const previous = cache.readQuery({ query: getCounterQuery });
        const counter = { value: previous.counter.value + 1, __typename: 'Counter' };
        const data = { counter };

        cache.writeQuery({ query: getCounterQuery, data });
        return counter;
      },
    },
  },
}];
