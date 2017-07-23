import bodyParser from 'koa-bodyparser';
import chalk from 'chalk';
import cors from 'kcors';
import requestLogger from 'koa-logger-winston';
import Koa from 'koa';
import path from 'path';
import postgraphql from 'postgraphql';
import webpack from 'webpack';
import webpackMiddleware from 'koa-webpack';

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
  app.use(webpackMiddleware({
    dev: {
      publicPath: '/build/',
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      stats: { colors: true },
      quiet: false,
      noInfo: true,
    },
    hot: {
      log: logger.info,
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000,
    },
    config: {
      resolve: {
        alias: {
          fervorAppRoutes: path.resolve(options.appLocation, 'apps', '__routes.js'),
        },
      },
      entry: [
        'react-hot-loader/patch',
        'webpack-hot-middleware/client',
        path.join(__dirname, '..', 'client', 'main.js'),
      ],
      output: {
        path: options.appLocation,
        publicPath: '/build/',
        filename: 'bundle.js',
        sourceMapFilename: 'bundle.js.map',
      },
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            test: /\.json$/,
            exclude: /node_modules/,
            use: 'json-loader',
          },
          {
            test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$|\.html$/,
            loader: 'file-loader',
          },
          {
            test: /\.scss$/,
            loader: 'style-loader!css-loader?modules&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader',
          },
          {
            test: /\.js$/,
            use: [
              { loader: 'react-hot-loader/webpack' },
              {
                loader: 'babel-loader',
                options: {
                  presets: ['es2015', 'react', 'stage-0'],
                  plugins: [],
                },
              },
            ],
            exclude: [/node_modules/],
          },
          // {
          //   test: /\.js$|\.jsx$/,
          //   loader: 'eslint-loader',
          //   exclude: [/node_modules/],
          // },
        ],
      },
      plugins: [
        new webpack.DefinePlugin({
          __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || true)),
          'process.env': {
            BROWSER: JSON.stringify(true),
            HOST: JSON.stringify(process.env.HOST),
          },
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin(),
      ],
    },
  }));

  await app.listen(options.port);
  logger.info(chalk.green(`Server started on: ${options.host}`));

  return app;
}
