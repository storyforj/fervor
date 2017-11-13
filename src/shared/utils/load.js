export default function load(
  name,
  { options = {}, default: _default = null },
) {
  let module;
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    module = require(`${options.appLocation}/build/${name}`);
  } catch (buildErr) {
    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      module = require(`${options.appLocation}/src/${name}`);
    } catch (srcErr) {
      module = _default;
    }
  }

  return module;
}
