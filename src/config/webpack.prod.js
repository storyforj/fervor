const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: 'bundle.css',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = (config) => ({
  entry: {
    app: [
      config.appPath,
    ],
  },
  output: {
    path: path.join(config.appPath, 'build'),
    filename: 'app.js',
  },
  stats: {
    colors: true,
    reasons: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || true)),
      'process.env': {
        BROWSER: JSON.stringify(true),
        HOST: JSON.stringify(process.env.HOST),
      },
    }),
    // new HtmlWebpackPlugin({
    //   template: __dirname + '/src/client/index.html',
    //   filename: 'index.html'
    // }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    extractSass,
  ],
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
        test: /\.js$/,
        loaders: ['react-hot-loader/webpack', 'babel-loader'],
        exclude: [/node_modules/, /app\/core\/node_modules/],
      },
      {
        test: /\.js$|\.jsx$/,
        loader: 'eslint-loader',
        exclude: [/node_modules/, /app\/core\/node_modules/],
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          }, {
            loader: 'sass-loader',
          }],
          // use style-loader in development
          fallback: 'style-loader',
        }),
      },
    ],
  },
  externals: {},
  devServer: {
    host: 'localhost',
    port: 8080,
    hot: true,
    publicPath: '/build/',
  },
});
