export default function load(
  name,
  { args = undefined, options = {}, default: _default = null },
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
      module = undefined;
    }
  }

  let res;
  if (module !== undefined) {
    if (args !== undefined) {
      res = module.default(args);
    } else {
      res = module.default();
    }
  }

  if (res === undefined) {
    res = _default;
  }

  return res;
}
