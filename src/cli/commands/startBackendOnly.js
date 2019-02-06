/* eslint-disable global-require */
const path = require('path');
const dotenv = require('dotenv');
require('isomorphic-fetch');
require('@babel/polyfill');
const startApp = require('../../server/server').default;

module.exports = (args) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const routes = require(`${process.cwd()}/build/urls`).default;

  if (process.env.DISABLE_DOT_ENV !== 'true') {
    if (args._[1]) {
      dotenv.config({ path: path.join(process.cwd(), args._[1], '.env.personal') });
      dotenv.config({ path: path.join(process.cwd(), args._[1], '.env') });
    } else {
      dotenv.config({ path: path.join(process.cwd(), '.env.personal') });
      dotenv.config({ path: path.join(process.cwd(), '.env') });
    }
  }

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
    isDev: false,
    routes,
  });
};
