import fs from 'fs';
import path from 'path';
import autoprefixer from 'autoprefixer';
import flexbugs from 'postcss-flexbugs-fixes';
import webpack from 'webpack';
import webpackMiddleware from 'koa-webpack';
import WorkboxPlugin from 'workbox-webpack-plugin';

import logger from '../shared/utils/logger';

export default (app, options) => {
  let devConfig = {
    resolve: {
      alias: {
        fervorAppRoutes: path.resolve(options.appLocation, 'src', 'urls.js'),
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
          test: /\.(scss|css)$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 2,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins() {
                  return [autoprefixer, flexbugs];
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                outputStyle: 'compressed',
              },
            },
          ],
        },
        {
          test: /\.js$/,
          use: [
            { loader: 'react-hot-loader/webpack' },
            {
              loader: 'babel-loader',
              // eslint-disable-next-line global-require
              options: require('./babelrcHelper').default(
                false,
                options.appLocation,
                true,
              ),
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
      new webpack.DllReferencePlugin({
        context: path.join(__dirname, '..'),
        // the next line requires a yarn build
        // eslint-disable-next-line
        manifest: require('../../lib/fervorVendors-manifest.json'),
      }),
      new webpack.optimize.CommonsChunkPlugin({
        async: true,
        minChunks: 2,
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.NamedModulesPlugin(),
      new WorkboxPlugin({
        globDirectory: options.appLocation,
        globPatterns: [],
        swDest: path.join(options.appLocation, 'build', 'sw.js'),
        runtimeCaching: [],
      }),
    ],
  };

  const customConfigPath = path.join(options.appLocation, 'src', 'config', 'webpack');
  if (fs.existsSync(`${customConfigPath}.js`)) {
    // Server side only - this is fine
    // eslint-disable-next-line import/no-dynamic-require, global-require
    devConfig = require(customConfigPath).default(devConfig);
  }

  const devSetup = {
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
    config: devConfig,
  };

  const wpMiddleware = options.webpackMiddleware || webpackMiddleware;
  app.use(wpMiddleware(devSetup));
};
