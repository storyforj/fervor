import bodyParser from 'koa-bodyparser';
import chalk from 'chalk';
import cors from 'kcors';
import requestLogger from 'koa-logger-winston';
import Koa from 'koa';
import koaSend from 'koa-send';
import koaStatic from 'koa-static';
import postgraphile from 'postgraphile';

import logger from '../shared/utils/logger';
import ssr from './ssr';

export default async function startApp(options = {}) {
  const app = new Koa();

  app.use(requestLogger(logger));

  const pgqlOpts = Object.assign(
    {
      graphiql: false,
    },
    options.postgraphileOptions || {},
  );
  // prevent graphqlRoute from being changed
  pgqlOpts.graphqlRoute = '/graphql';
  app.use(postgraphile(options.db, 'public', pgqlOpts));

  app.use(cors());
  app.use(bodyParser());
  app.use(ssr(options.routes, options.appLocation));
  if (!options.disableWebpack) {
    // eslint-disable-next-line global-require
    require('../config/webpack.dev').default(app, options);
  }
  app.use(koaStatic(options.appLocation, { gzip: true }));
  app.use(async (ctx) => {
    // NOTE: if we need to redirect another script, let's find a better strategy
    if (ctx.path === '/sw.js') {
      await koaSend(ctx, '/build/sw.js');
    }
    if (ctx.path === '/workbox-sw.prod.v2.0.0.js') {
      await koaSend(ctx, '/build/workbox-sw.prod.v2.0.0.js');
    }
  });

  await app.listen(options.port);
  logger.info(chalk.green(`Server started on: ${options.host}`));

  return app;
}
