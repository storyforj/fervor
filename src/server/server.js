import bodyParser from 'koa-bodyparser';
import chalk from 'chalk';
import cors from 'kcors';
import requestLogger from 'koa-logger-winston';
import Koa from 'koa';
import koaStatic from 'koa-static';
import postgraphql from 'postgraphql';

import logger from '../shared/utils/logger';
import ssr from './ssr';

export default async function startApp(options = {}) {
  const app = new Koa();

  app.use(requestLogger(logger));

  const pgqlOpts = Object.assign(
    {
      // watchPg: true,
      // classicIds: true,
      graphiql: true,
      graphiqlRoute: '/admin/graphiql',
      // exportJsonSchemaPath: path.join(options.appLocation, '.graphql.json'),
    },
    options.postgraphql || {},
  );
  app.use(postgraphql(options.db, 'public', pgqlOpts));

  app.use(cors());
  app.use(bodyParser());
  app.use(ssr(options.routes));
  if (!options.disableWebpack) {
    // eslint-disable-next-line global-require
    require('../config/webpack.dev').default(app, options);
  }
  app.use(koaStatic(options.appLocation, { gzip: true }));

  await app.listen(options.port);
  logger.info(chalk.green(`Server started on: ${options.host}`));

  return app;
}
