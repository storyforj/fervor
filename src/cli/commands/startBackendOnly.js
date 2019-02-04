/* eslint-disable global-require */
const path = require('path');
const dotenv = require('dotenv');
require('isomorphic-fetch');
require('@babel/polyfill');
require('@babel/register')(require('../../config/babelrcHelper').default(true, process.cwd(), true));
const startApp = require('../../server/server').default;

module.exports = (args) => {
  if (args._[1]) {
    dotenv.config({ path: path.join(process.cwd(), args._[1], '.env') });
    dotenv.config({ path: path.join(process.cwd(), args._[1], '.env.personal') });
  } else {
    dotenv.config({ path: path.join(process.cwd(), '.env') });
    dotenv.config({ path: path.join(process.cwd(), '.env.personal') });
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
