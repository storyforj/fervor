import path from 'path';
import autoprefixer from 'autoprefixer';
import flexbugs from 'postcss-flexbugs-fixes';
import webpack from 'webpack';
import webpackMiddleware from 'koa-webpack';

import logger from '../shared/utils/logger';

export default (app, options) => {
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
            test: /\.scss$/,
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
        new webpack.DllReferencePlugin({
          context: path.join(__dirname, '..'),
          // the next line requires a yarn build
          // eslint-disable-next-line
          manifest: require('../../lib/fervorVendors-manifest.json'),
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin(),
      ],
    },
  }));
};
