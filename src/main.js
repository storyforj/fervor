#!/usr/bin/env node

const path = require('path');
const dotenv = require('dotenv');
const chokidar = require('chokidar');
require('babel-polyfill');
require('babel-register')({
  presets: [
    'es2015',
    'react',
    'stage-0',
  ],
});
const startApp = require('./server').default;

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

watcher.on('ready', () => {
  watcher.on('all', () => {
    Object.keys(require.cache).forEach((id) => {
      // eslint-disable-next-line
      if (/[\/\\]app[\/\\]/.test(id)) delete require.cache[id];
    });
  });
});
