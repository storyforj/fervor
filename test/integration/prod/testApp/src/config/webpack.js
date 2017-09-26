import CopyPlugin from 'copy-webpack-plugin';

export default (config) => {
  config.plugins.push(CopyPlugin([
    { from: `${__dirname}/test123.js` },
  ]));

  return config;
};
