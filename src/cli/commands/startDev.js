/* eslint-disable global-require */

export default async () => {
  const path = require('path');
  const dotenv = require('dotenv');
  const chokidar = require('chokidar');
  require('isomorphic-fetch');
  require('babel-polyfill');
  require('babel-register')({
    presets: [
      'es2015',
      'react',
      'stage-0',
    ],
  });
  const startApp = require('../../server/server').default;

  let routes;
  let watcher;

  if (process.argv[2]) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    routes = require(`${process.cwd()}/${process.argv[2]}/apps/_routes`).default;
    watcher = chokidar.watch(`${process.cwd()}/${process.argv[2]}`);
  } else {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    routes = require(`${process.cwd()}/apps/_routes`).default;
    watcher = chokidar.watch(`${process.cwd()}`);
  }

  dotenv.config({ path: path.join(process.cwd(), '.env') });

  startApp({
    appName: process.env.APP_NAME,
    db: process.env.DATABASE_URL,
    host: process.env.HOST || 'http://localhost:3000',
    port: process.env.PORT || 3000,
    appLocation: process.cwd(),
    routes,
  });

  // TODO: this needs work
  watcher.on('ready', () => {
    watcher.on('all', (event, filePath) => {
      delete require.cache[filePath];
    });
  });
};
