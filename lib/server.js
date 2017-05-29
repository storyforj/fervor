import bodyParser from 'koa-bodyparser';
import chalk from 'chalk';
import cors from 'kcors';
import requestLogger from 'koa-logger-winston';
import Koa from 'koa';
import postgraphql from 'postgraphql';

import logger from './logger';

export default async function startApp(options = {}) {
    const app = new Koa();

    app.use(requestLogger(logger));

    const pgqlOpts = Object.assign(
        {
            // watchPg: true,
            graphiql: true,
            graphiqlRoute: '/admin/graphiql',
        },
        options.postgraphql || {},
    );
    app.use(postgraphql(options.db, 'public', pgqlOpts));

    app.use(cors());
    app.use(bodyParser());

    await app.listen(options.port);
    logger.info(chalk.green(`Server started on: ${options.host}`));

    return app;
}
