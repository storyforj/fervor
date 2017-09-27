import CopyPlugin from 'copy-webpack-plugin';

export default (config) => {
  config.plugins.push(CopyPlugin([
    { from: `${__dirname}/test123.js` },
  ]));

  config.module.loaders.push({
    test: /\.css$/,
    loaders: [
      'style-loader', 'css-loader',
    ],
  });

  return config;
};
