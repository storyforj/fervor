import bodyParser from 'koa-bodyparser';
import chalk from 'chalk';
import cookie from 'koa-cookie';
import cors from 'kcors';
import requestLogger from 'koa-logger-winston';
import Koa from 'koa';
import postgraphile from 'postgraphile';

import { setPGQLOpts } from './graphql/pgqlOpts';
import { createPgPool } from './graphql/pgPool';
import appManifest from './appManifest';
import logger from '../shared/utils/logger';
import load from '../shared/utils/load';
import { startSchemaWatcher } from './graphql/schemaWatcher';
import ssr from './ssr';
import staticAssets from './static';

export default async function startApp(options = {}) {
  const app = new Koa();

  app.use(requestLogger(logger));

  const pgqlOpts = setPGQLOpts(options);
  const pgPool = createPgPool(options, pgqlOpts);
  await startSchemaWatcher(pgPool, 'public', pgqlOpts);
  app.use(postgraphile(pgPool, 'public', pgqlOpts));

  app.use(cors());
  app.use(bodyParser());
  app.use(cookie());

  // load any user defined middleware
  const middleware = load('middleware', { options, default: () => {} });
  if (middleware.default) {
    middleware.default({ app, logger, options });
  }

  app.use(appManifest(options));
  if (!options.disableWebpack) {
    // eslint-disable-next-line global-require
    require('../config/webpack.dev').default(app, options);
  }
  app.use(staticAssets(options));
  app.use(ssr(options));

  await app.listen(options.port);
  logger.info(chalk.green(`Server started on: ${options.host}`));

  return app;
}
