require('isomorphic-fetch');
require('babel-polyfill');
require('babel-register')(require('./babelrcHelper').default(true, false));

const fs = require('fs');
const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const globToRegExp = require('glob-to-regexp');
const flexbugs = require('postcss-flexbugs-fixes');
const webpack = require('webpack');
const { GenerateSW } = require('workbox-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const hasConfig = require('../shared/utils/hasConfig');
const hasClientResolvers = require('../shared/utils/hasClientResolvers');
const ChunkManifestPlugin = require('./ChunkManifestPlugin');
const clientSideBabelConfig = require('./babelrcHelper').default(false, process.cwd(), true);

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
  const hasRenderingConfig = hasConfig.default(process.cwd(), 'rendering');

  let prodConfig = {
    mode: 'production',
    resolve: {
      alias: {
        fervorAppRoutes: path.resolve(process.cwd(), 'src', 'urls.js'),
        fervorConfigRendering: hasRenderingConfig ?
          path.join(process.cwd(), 'src', 'config', 'rendering.js') :
          path.join(__dirname, 'renderingConfig.js'),
        fervorClientResolvers: hasClientResolvers.default(process.cwd()) ?
          path.resolve(process.cwd(), 'src', 'graph', 'client.js') :
          path.join(__dirname, 'defaultResolvers.js'),
      },
    },
    entry: {
      bundle: path.join(__dirname, '..', 'client', 'main.js'),
    },
    output: {
      path: buildDir,
      publicPath: '/build/',
      filename: '[name]-[chunkhash:6].js',
    },
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
            MiniCSSExtractPlugin.loader,
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
      new MiniCSSExtractPlugin({
        filename: 'bundle-[chunkhash:6].css',
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
      new GenerateSW({
        swDest: path.join(buildDir, 'sw.js'),
        importWorkboxFrom: 'cdn',
        runtimeCaching,
      }),
    ],
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
      splitChunks: {
        minChunks: 2,
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css|\.scss$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
  };

  const customConfigPath = path.join(process.cwd(), 'src', 'config', 'webpack');
  if (fs.existsSync(`${customConfigPath}.js`)) {
    // Server side only - this is fine
    // eslint-disable-next-line import/no-dynamic-require, global-require
    prodConfig = require(customConfigPath).default(prodConfig);
  }

  return prodConfig;
};
