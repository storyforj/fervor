import bodyParser from 'koa-bodyparser';
import chalk from 'chalk';
import cors from 'kcors';
import fs from 'fs';
import requestLogger from 'koa-logger-winston';
import Koa from 'koa';
import postgraphile from 'postgraphile';
import appManifest from './appManifest';

import logger from '../shared/utils/logger';
import ssr from './ssr';
import staticAssets from './static';

export default async function startApp(options = {}) {
  const app = new Koa();

  app.use(requestLogger(logger));

  const pgqlOpts = { graphiql: false };
  let graphOptions = {};
  if (options.disableWebpack && (
    fs.existsSync(`${options.appLocation}/build/graph.js`) ||
    fs.existsSync(`${options.appLocation}/build/graph/index.js`)
  )) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    graphOptions = require(`${options.appLocation}/build/graph`).default();
  } else if (
    fs.existsSync(`${options.appLocation}/src/graph.js`) ||
    fs.existsSync(`${options.appLocation}/src/graph/index.js`)
  ) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    graphOptions = require(`${options.appLocation}/src/graph`).default();
  }

  if (graphOptions.graphqlRoute) {
    logger.warn('Changing the graphqlRoute is disabled. We\'ve reverted it back to /graphql');
  }
  Object.assign(
    pgqlOpts,
    graphOptions,
    { graphqlRoute: '/graphql' },
  );

  app.use(postgraphile(options.db, 'public', pgqlOpts));
  app.use(cors());
  app.use(bodyParser());

  // add middleware from the user's app if it exists
  // we need to load it from a different place in "prod" vs "dev"
  if (options.disableWebpack && (
    fs.existsSync(`${options.appLocation}/build/middleware.js`) ||
    fs.existsSync(`${options.appLocation}/build/middleware/index.js`)
  )) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(`${options.appLocation}/build/middleware`).default({ app, logger, options });
  } else if (
    fs.existsSync(`${options.appLocation}/src/middleware.js`) ||
    fs.existsSync(`${options.appLocation}/src/middleware/index.js`)
  ) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(`${options.appLocation}/src/middleware`).default({ app, logger, options });
  }

  app.use(appManifest(options));
  app.use(ssr(options));
  if (!options.disableWebpack) {
    // eslint-disable-next-line global-require
    require('../config/webpack.dev').default(app, options);
  }
  app.use(staticAssets());

  await app.listen(options.port);
  logger.info(chalk.green(`Server started on: ${options.host}`));

  return app;
}
