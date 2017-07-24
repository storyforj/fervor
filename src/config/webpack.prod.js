const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const autoprefixer = require('autoprefixer');
const flexbugs = require('postcss-flexbugs-fixes');

module.exports = () => ({
  resolve: {
    alias: {
      fervorAppRoutes: path.resolve(process.cwd(), 'src', 'urls.js'),
      react: 'preact-compat',
      'react-dom': 'preact-compat',
    },
  },
  entry: [
    path.join(__dirname, '..', 'client', 'main.js'),
  ],
  output: {
    path: path.join(process.cwd(), 'build'),
    publicPath: '/build/',
    filename: 'bundle.js',
  },
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
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
        }),
      },
      {
        test: /\.js$/,
        use: [
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
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      allChunks: true,
      filename: 'bundle.css',
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(false),
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BROWSER: JSON.stringify(true),
        HOST: JSON.stringify(process.env.HOST),
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      parallel: true,
      workers: 5,
      ecma: 8,
    }),
    new OfflinePlugin({
      relativePaths: false,
      AppCache: false,
      excludes: ['_redirects'],
      ServiceWorker: {
        events: true,
      },
      cacheMaps: [
        {
          match: /.*/,
          to: '/',
          requestTypes: ['navigate'],
        },
      ],
      publicPath: '/build/',
    }),
  ],
});
