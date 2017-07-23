const webpack = require('webpack');
const path = require('path');

module.exports = () => ({
  resolve: {
    alias: {
      fervorAppRoutes: path.resolve(process.cwd(), 'src', 'urls.js'),
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
        loader: 'style-loader!css-loader?modules&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader',
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
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
});
