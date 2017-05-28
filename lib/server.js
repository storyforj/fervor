import bodyParser from 'koa-bodyparser';
import chalk from 'chalk';
import cors from 'kcors';
import logger from 'koa-bunyan-logger';
import Koa from 'koa';
import postgraphql from 'postgraphql';

export default async function startApp(options = {}) {
    const app = new Koa();
    const dbParts = options.db.split('/');
    const dbName = dbParts.pop();
    const dbConnection = dbParts.join('/');

    app.use(cors());
    app.use(bodyParser());
    app.use(logger({ 
        name: options.appName,
        serializers: logger.stdSerializers 
    }));
    app.use(logger.requestIdContext());
    app.use(logger.requestLogger({
        serializers: logger.stdSerializers 
    }));

    app.use(
        postgraphql(
            dbConnection,
            dbName,
            Object.assign({
                // watchPg: true,
                graphiql: true,
                graphiqlRoute: '/admin/graphiql',
            }, options.postgraphql || {})
        ),
    )

    await app.listen(options.port);
    console.log(chalk.green(`Server started on: ${options.host}`));

    return app;
}