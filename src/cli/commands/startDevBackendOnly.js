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
    dotenv.config({ path: path.join(process.cwd(), args._[1], '.env') });
    dotenv.config({ path: path.join(process.cwd(), args._[1], '.env.personal') });
  } else {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    watcher = chokidar.watch(`${process.cwd()}`);
    dotenv.config({ path: path.join(process.cwd(), '.env') });
    dotenv.config({ path: path.join(process.cwd(), '.env.personal') });
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
