// import { graphql } from 'graphql';
// import Pool from 'pg-pool';
// import { createPostGraphQLSchema, withPostGraphQLContext } from 'postgraphql';
import {
  ApolloClient,
  createNetworkInterface,
} from 'react-apollo';

// import logger from '../logger';

// const pool = new Pool({
//   host: 'localhost',
//   database: 'example',
//   post: 5432,
//   min: 2,
//   max: 10,
// });

// async function localRequest(operation, variables) {
//   debugger;
//   const schema = await createPostGraphQLSchema('postgres://localhost:5432/example');
//   const j = await withPostGraphQLContext(
//     {
//       pgPool: pool,
//       // jwtToken: '...',
//       // jwtSecret: '...',
//       // pgDefaultRole: '...',
//     },
//     async (context) => graphql(
//       schema,
//       operation.text,
//       null,
//       { ...context },
//       variables,
//       operation.name,
//     ),
//   );
//   return j;
// }

// class PostGraphQLNetworkInterface {
//   async query(req) {
//     debugger;
//     const result = await localRequest(req.query.loc.source.body, req.variables);
//     return result;
//   }
// }

// function createLocalNetworkInterface(opts) {
//   return new PostGraphQLNetworkInterface(opts);
// }

export default new ApolloClient({
  ssrMode: true,
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:3000/graphql',
  }),
});
