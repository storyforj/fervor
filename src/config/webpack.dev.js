import fs from 'fs';
import path from 'path';
import autoprefixer from 'autoprefixer';
import flexbugs from 'postcss-flexbugs-fixes';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import webpackMiddleware from 'koa-webpack';
import { GenerateSW } from 'workbox-webpack-plugin';

import hasConfig from '../shared/utils/hasConfig';
import logger from '../shared/utils/logger';

export default (app, options) => {
  const hasRenderingConfig = hasConfig(options.appLocation, 'rendering');
  let devConfig = {
    mode: 'development',
    resolve: {
      alias: {
        fervorAppRoutes: path.resolve(options.appLocation, 'src', 'urls.js'),
        fervorConfigRendering: hasRenderingConfig ?
          path.join(options.appLocation, 'src', 'config', 'rendering.js') :
          path.join(__dirname, 'renderingConfig.js'),
      },
    },
    entry: [
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
      rules: [
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
          use: [
            { loader: 'style-loader' },
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
                plugins: () => (
                  [autoprefixer(), flexbugs()]
                ),
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
            {
              loader: 'babel-loader',
              // eslint-disable-next-line global-require
              options: require('./babelrcHelper').default(
                false,
                options.appLocation,
                true,
                ['react-hot-loader/babel'],
              ),
            },
          ],
          exclude: [/node_modules/],
        },
      ],
    },
    plugins: [
      new MiniCSSExtractPlugin({
        filename: 'bundle-[chunkhash:6].css',
      }),
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
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.NamedModulesPlugin(),
      new GenerateSW({
        runtimeCaching: [],
        swDest: path.join(options.appLocation, 'build', 'sw.js'),
        importWorkboxFrom: 'cdn',
      }),
    ],
    optimization: {
      splitChunks: {
        minChunks: 2,
      },
    },
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
