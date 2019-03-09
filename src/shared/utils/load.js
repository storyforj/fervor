import logger from './logger';

export default function load(
  name,
  { options = {}, default: _default = null },
) {
  let module;

  if (options.isDev) {
    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      module = require(`${options.appLocation}/src/${name}`);
    } catch (srcErr) {
      if (!srcErr.message.includes('Cannot find module')) {
        logger.error(srcErr);
      }
      module = _default;
    }
  } else {
    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      module = require(`${options.appLocation}/build/${name}`);
    } catch (buildErr) {
      if (!buildErr.message.includes('Cannot find module')) {
        logger.error(buildErr);
      }
      module = _default;
    }
  }

  return module;
}
