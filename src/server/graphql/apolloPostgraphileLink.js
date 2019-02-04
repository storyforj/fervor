import getAttr from 'lodash/get';
import { ApolloLink, Observable } from 'apollo-link';

import performQuery from './performQuery';

const createPostgraphileLink = () => {
  return new ApolloLink((operation) => {
    const context = operation.getContext();

    return new Observable((observer) => {
      return performQuery(
        operation.query,
        operation.variables,
        getAttr(context, 'authorization.jwtToken', undefined),
        operation.operationName,
      ).then((data) => {
        if (!observer.closed) {
          observer.next(data);
          observer.complete();
        }

        return data;
      }).catch((error) => {
        if (!observer.closed) {
          observer.error(error);
        }
      });
    });
  });
};

export default createPostgraphileLink;
