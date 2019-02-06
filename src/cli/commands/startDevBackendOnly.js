/* eslint-disable global-require */
const path = require('path');
const dotenv = require('dotenv');
const chokidar = require('chokidar');
require('isomorphic-fetch');
require('@babel/polyfill');
require('@babel/register')(require('../../config/babelrcHelper').default(true, process.cwd(), true));
const startApp = require('../../server/server').default;

module.exports = (args) => {
  let watcher;

  if (args._[1]) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    watcher = chokidar.watch(`${process.cwd()}/${args._[1]}`);
    if (process.env.DISABLE_DOT_ENV !== 'true') {
      dotenv.config({ path: path.join(process.cwd(), args._[1], '.env.personal') });
      dotenv.config({ path: path.join(process.cwd(), args._[1], '.env') });
    }
  } else {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    watcher = chokidar.watch(`${process.cwd()}`);
    if (process.env.DISABLE_DOT_ENV !== 'true') {
      dotenv.config({ path: path.join(process.cwd(), '.env.personal') });
      dotenv.config({ path: path.join(process.cwd(), '.env') });
    }
  }

  watcher.on('ready', () => {
    watcher.on('all', () => {
      Object.keys(require.cache).forEach((id) => {
        if (id.indexOf(`${process.cwd()}/src`) > -1) {
          delete require.cache[id];
        }
      });
    });
  });

  const port = process.env.PORT || 3000;
  const host = (process.env.HOST || '').replace('3000', process.env.PORT);

  return startApp({
    appName: process.env.APP_NAME,
    appShortName: process.env.APP_SHORT_NAME || process.env.APP_NAME,
    appFavicon: process.env.FAVICON,
    db: process.env.DATABASE_URL,
    host: host || `http://localhost:${port}`,
    port,
    appLocation: process.cwd(),
    disableWebpack: true,
    disableClient: true,
    isDev: true,
    get routes() {
      if (args._[1]) {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        return require(`${process.cwd()}/${args._[1]}/src/urls`).default;
      }

      // eslint-disable-next-line global-require, import/no-dynamic-require
      return require(`${process.cwd()}/src/urls`).default;
    },
  });
};
