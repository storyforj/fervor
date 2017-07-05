import { graphql } from 'graphql';
import Pool from 'pg-pool';
import { createPostGraphQLSchema, withPostGraphQLContext } from 'postgraphql';
import {
  createOperationSelector,
  getOperation,
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';

import logger from '../logger';

const pool = new Pool({
  host: 'localhost',
  database: 'example',
  post: 5432,
  min: 2,
  max: 10,
});

async function localRequest(operation, variables) {
  const schema = await createPostGraphQLSchema('postgres://localhost:5432/example');
  return withPostGraphQLContext(
    {
      pgPool: pool,
      // jwtToken: '...',
      // jwtSecret: '...',
      // pgDefaultRole: '...',
    },
    async (context) => graphql(
      schema,
      operation.text,
      null,
      { ...context },
      variables,
      operation.name,
    ),
  );
}

export async function fetchQuery(operation, variables) {
  return localRequest(operation, variables);
}

export const createEnvironment = async (rootQuery, variables) => {
  const network = Network.create(fetchQuery);

  const source = new RecordSource();
  const store = new Store(source);

  const environment = new Environment({
    network,
    store,
  });

  const operation = createOperationSelector(
    getOperation(rootQuery),
    variables,
  );
  environment.retain(operation.root);

  return new Promise((resolve, reject) => {
    environment.sendQuery({
      operation,
      onCompleted: () => resolve(environment),
      onError: (e) => {
        logger.error('QueryLookupRender Error', e.text);
        reject(`QueryLookupRender Error ${e.text}`);
      },
    });
  });
};
