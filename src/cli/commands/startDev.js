/* eslint-disable global-require */
const path = require('path');
const dotenv = require('dotenv');
// const chokidar = require('chokidar');
require('isomorphic-fetch');
require('babel-polyfill');
require('babel-register')(require('../../config/babelrcHelper').default(true, process.cwd(), true));
const startApp = require('../../server/server').default;

module.exports = (args) => {
  let routes;
  // let watcher;

  if (args._[1]) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    routes = require(`${process.cwd()}/${args._[1]}/src/urls`).default;
    // watcher = chokidar.watch(`${process.cwd()}/${args._[1]}`);
    dotenv.config({ path: path.join(process.cwd(), args._[1], '.env') });
  } else {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    routes = require(`${process.cwd()}/src/urls`).default;
    // watcher = chokidar.watch(`${process.cwd()}`);
    dotenv.config({ path: path.join(process.cwd(), '.env') });
  }

  // TODO: this needs work
  // watcher.on('ready', () => {
  //   watcher.on('all', (event, filePath) => {
  //     delete require.cache[filePath];
  //   });
  // });

  return startApp({
    appName: process.env.APP_NAME,
    appShortName: process.env.APP_SHORT_NAME || process.env.APP_NAME,
    appFavicon: process.env.FAVICON,
    db: process.env.DATABASE_URL,
    host: process.env.HOST || 'http://localhost:3000',
    port: process.env.PORT || 3000,
    appLocation: process.cwd(),
    postgraphileOptions: JSON.parse(process.env.POSTGRAPHILE_OPTS || '{}'),
    routes,
  });
};
