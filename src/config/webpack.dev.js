const webpack = require('webpack');
const path = require('path');

module.exports = (config) => ({
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      config.appPath,
    ],
  },
  output: {
    path: path.join(config.appPath, 'build'),
    publicPath: 'http://localhost:8080/build/',
    filename: 'app.js',
    sourceMapFilename: '[name].js.map',
  },
  devtool: 'inline-source-map',
  stats: {
    colors: true,
    reasons: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || true)),
      'process.env': {
        BROWSER: JSON.stringify(true),
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
