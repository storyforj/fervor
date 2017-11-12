import fs from 'fs';

export default function load(
  name,
  { args = undefined, options = {}, default: _default = null },
) {
  let module = _default;
  if (
    options.disableWebpack &&
    (fs.existsSync(`${options.appLocation}/build/${name}.js`) ||
      fs.existsSync(`${options.appLocation}/build/${name}/index.js`))
  ) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    module = require(`${options.appLocation}/build/${name}`);
  } else if (
    fs.existsSync(`${options.appLocation}/src/${name}.js`) ||
    fs.existsSync(`${options.appLocation}/src/${name}/index.js`)
  ) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    module = require(`${options.appLocation}/src/${name}`);
  }

  let res;
  if (args !== undefined) {
    res = module.default(args);
  } else {
    res = module.default();
  }

  return res;
}
