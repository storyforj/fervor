import fs from 'fs';
import path from 'path';

export default (isServer, appLocation, useSrc, plugins = []) => {
  let config = {
    presets: [
      ['env', { targets: { browsers: ['last 2 versions', 'safari >= 7'] } }],
      'react',
      'stage-0',
    ],
    plugins: [
      [
        'make-lazy',
        {
          // eslint-disable-next-line no-useless-escape
          paths: ['(src|lib)\/urls\.js$'],
          moduleExceptions: ['^[^(./|../)]'],
        },
      ].concat(plugins),
    ],
  };

  if (isServer) {
    config.plugins = [
      [
        'css-modules-transform',
        {
          generateScopedName: '[name]__[local]___[hash:base64:5]',
          extensions: ['.scss'],
        },
      ],
      [
        'transform-runtime',
      ],
    ];
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
