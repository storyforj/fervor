import lodashMerge from 'lodash.merge';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';

import createPostgraphileLink from '../graphql/apolloPostgraphileLink';
import initStore from '../../shared/store';
import load from '../../shared/utils/load';

export default (options, ctx) => {
  const cache = new InMemoryCache({});
  const schemaLink = createPostgraphileLink();
  let clientResolvers = load('graph/client', {
    options,
    default: [{ // load accepts a "default" to fallback to
      defaults: {}, // the default state
      resolvers: {},
    }],
  });

  // normalizing for es6 import purposes
  clientResolvers = clientResolvers.default ? clientResolvers.default : clientResolvers;

  const clientStateLink = withClientState({
    ...lodashMerge(...clientResolvers),
    cache,
  });
  const middlewareLink = setContext(() => {
    if (!ctx.cookie || !ctx.cookie.authJWT) { return undefined; }

    return {
      authorization: {
        jwtToken: ctx.cookie.authJWT,
      },
    };
  });

  const link = ApolloLink.from([clientStateLink, middlewareLink, schemaLink]);
  const serverClient = new ApolloClient({
    ssrMode: true,
    cache,
    link,
  });
  const store = initStore({ router: { location: { pathname: ctx.req.url } } });

  return {
    serverClient,
    store,
  };
};
