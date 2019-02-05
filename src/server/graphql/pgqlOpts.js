import load from '../../shared/utils/load';
import logger from '../../shared/utils/logger';

let opts = {};

export const setPGQLOpts = (options) => {
  const pgqlOpts = {
    graphiql: false,
  };

  // load user defined graphQL options
  const graph = load('graph', { options, default: { default: () => ({}) } });
  const graphOptions = graph.default();

  if (graphOptions.graphqlRoute) {
    logger.warn('Changing the graphqlRoute is disabled. We\'ve reverted it back to /graphql');
  }
  Object.assign(
    pgqlOpts,
    graphOptions,
    { graphqlRoute: '/graphql' },
  );

  opts = pgqlOpts;
  return opts;
};

export const getPGQLOpts = () => opts;
