const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  cache: true,
  entry: {
    fervorVendors: [path.join(__dirname, 'vendor.js')],
  },
  output: {
    path: path.join(__dirname, '..'),
    filename: '[name].js',
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '..', '..', 'lib', 'fervorVendors-manifest.json'),
      name: '[name]',
      context: path.resolve(__dirname),
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
  ],
  optimization: { minimize: true },
  performance: {
    hints: false,
  },
};
