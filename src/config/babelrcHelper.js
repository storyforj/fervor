import fs from 'fs';
import path from 'path';

import presetEnv from '@babel/preset-env';
import presetReact from '@babel/preset-react';
import pluginTransformRuntime from '@babel/plugin-transform-runtime';
import pluginSyntaxDynamicImport from '@babel/plugin-syntax-dynamic-import';
import pluginProposalClassProperties from '@babel/plugin-proposal-class-properties';
import pluginProposalPipelineOperator from '@babel/plugin-proposal-pipeline-operator';
import pluginProposalDecorators from '@babel/plugin-proposal-decorators';
import pluginDynamicImportNode from 'babel-plugin-dynamic-import-node';

/* eslint-disable global-require */

export default (isServer, appLocation, useSrc, plugins = []) => {
  let config = {
    presets: [
      [presetEnv, { targets: { browsers: ['last 2 versions', 'safari >= 7'] } }],
      presetReact,
    ],
    plugins: [
      pluginTransformRuntime,
      pluginSyntaxDynamicImport,
      [pluginProposalClassProperties, { loose: true }],
      [pluginProposalPipelineOperator, { proposal: 'minimal' }],
      [pluginProposalDecorators, { decoratorsBeforeExport: true }],
    ].concat(plugins),
  };

  if (isServer) {
    config.plugins = [
      [
        require('babel-plugin-css-modules-transform').default,
        {
          generateScopedName: '[name]__[local]___[hash:base64:5]',
          extensions: ['.scss'],
        },
      ],
      pluginTransformRuntime,
      pluginSyntaxDynamicImport,
      pluginDynamicImportNode,
      [pluginProposalClassProperties, { loose: true }],
      [pluginProposalPipelineOperator, { proposal: 'minimal' }],
      [pluginProposalDecorators, { decoratorsBeforeExport: true }],
    ].concat(plugins);
  }

  if (appLocation === false) {
    return config;
  }

  const customConfigPathSrc = path.join(appLocation, 'src', 'config', 'babel.js');
  const customConfigPathBuild = path.join(appLocation, 'build', 'config', 'babel.js');
  if (useSrc && fs.existsSync(customConfigPathSrc)) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    config = require(`${appLocation}/src/config/babel`).default(config, isServer);
  } else if (fs.existsSync(customConfigPathBuild)) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    config = require(`${appLocation}/build/config/babel`).default(config, isServer);
  }

  return config;
};
