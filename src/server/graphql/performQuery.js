import { graphql } from 'graphql';
import { withPostGraphileContext } from 'postgraphile';
import { print } from 'graphql/language/printer';
import chalk from 'chalk';

import logger from '../../shared/utils/logger';
import { decodeJWT } from '../utils/security';
import { getPgPool } from './pgPool';
import { getSchema } from './schemaWatcher';
import { getPGQLOpts } from './pgqlOpts';

export default async function performQuery(
  query,
  variables,
  jwtToken,
  operationName,
) {
  const options = getPGQLOpts();
  const queryPlainText = print(query);
  const queryCondensed = queryPlainText.replace(/\s\s+/g, ' ').replace(/\n/g, '');

  const startTime = Date.now();

  let role;
  try {
    role = decodeJWT(jwtToken).role;
  } catch (e) {
    role = options.pgDefaultRole || 'anonymous';
  }

  const value = withPostGraphileContext(
    {
      ...options,
      pgPool: getPgPool(),
      jwtToken,
    },
    async (context) => {
      const result = graphql(
        getSchema(),
        queryPlainText,
        null,
        { ...context },
        variables,
        operationName,
      ).then((data) => {
        const totalTime = Date.now() - startTime;
        logger.info(`${chalk.green('0 error(s)')} as ${chalk.magenta(role)} in ${chalk.grey(`${totalTime}ms`)} :: ${queryCondensed}`);
        return data;
      }).catch((e) => {
        const totalTime = Date.now() - startTime;
        const errorCount = chalk.red(`${e.errors.length} error(s)`);
        logger.error(`${errorCount} as ${chalk.magenta(role)} in ${chalk.grey(`${totalTime}ms`)} :: ${queryCondensed}`);
      });

      return result;
    },
  );

  return value;
}
