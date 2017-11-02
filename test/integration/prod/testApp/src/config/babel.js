export default (config, isServer) => {
  if (isServer) {
    config.plugins[0][1].extensions.push('.jss');
  }

  return config;
};
