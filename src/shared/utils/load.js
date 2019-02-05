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
      module = _default;
    }
  } else {
    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      module = require(`${options.appLocation}/build/${name}`);
    } catch (buildErr) {
      module = _default;
    }
  }

  return module;
}
