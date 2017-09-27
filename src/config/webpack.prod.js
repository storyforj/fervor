require('isomorphic-fetch');
require('babel-polyfill');
require('babel-register')(require('./babelrcHelper').default(true));

const fs = require('fs');
const path = require('path');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const globToRegExp = require('glob-to-regexp');
const flexbugs = require('postcss-flexbugs-fixes');
const webpack = require('webpack');
const WorkboxPlugin = require('workbox-webpack-plugin');
const ChunkManifestPlugin = require('./ChunkManifestPlugin');
const clientSideBabelConfig = require('./babelrcHelper').default(false);

const buildDir = path.join(process.cwd(), 'build');

function generateCacheSettings(globUrl) {
  return {
    urlPattern: globToRegExp(`*${globUrl}`),
    // opt'ing to not cache for right now
    // perhaps we should allow routes to define this
    handler: 'networkFirst',
  };
}

let runtimeCaching = [];

if (process.env.TEST_ENV !== 'integration') {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const urls = require(`${process.cwd()}/src/urls`).default;
  runtimeCaching = Object.keys(urls).map(generateCacheSettings);
}

module.exports = () => {
  let prodConfig = {
    resolve: {
      alias: {
        fervorAppRoutes: path.resolve(process.cwd(), 'src', 'urls.js'),
      },
    },
    entry: {
      bundle: path.join(__dirname, '..', 'client', 'main.js'),
    },
    output: {
      path: buildDir,
      publicPath: '/build/',
      filename: '[name]-[hash:6].js',
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
              options: clientSideBabelConfig,
            },
          ],
          exclude: [/node_modules/],
        },
      ],
    },
    plugins: [
      new ChunkManifestPlugin(),
      new ExtractTextPlugin({
        allChunks: true,
        filename: 'bundle-[hash:6].css',
      }),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(false),
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
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
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        parallel: true,
        workers: 5,
        ecma: 8,
      }),
      new WorkboxPlugin({
        globDirectory: process.cwd(),
        globPatterns: [
          'build/**/bundle-*.{js,css}',
          'assets/**/*.{png,jpg,jpeg,gif,woff,woff2,svg,js,css}',
        ],
        swDest: path.join(buildDir, 'sw.js'),
        runtimeCaching,
      }),
    ],
  };

  const customConfigPath = path.join(process.cwd(), 'src', 'config', 'webpack');
  if (fs.existsSync(`${customConfigPath}.js`)) {
    // Server side only - this is fine
    // eslint-disable-next-line import/no-dynamic-require, global-require
    prodConfig = require(customConfigPath).default(prodConfig);
  }

  return prodConfig;
};
