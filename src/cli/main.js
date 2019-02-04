/* eslint-disable max-len */
const runCommands = require('./utils/runCommands');

runCommands([
  {
    name: 'build',
    options: {
      directory: 'Defaults to process.cwd(). This is the directory for your app, it expects a `src` directory at it\'s root.',
    },
    description: 'Creates a built version of the app for web/node use.',
  },
  {
    name: 'create',
    options: {
      directory: 'If a directory is specifed, the project will be created in that directory, otherwise it will be created in the current directory.',
    },
    description: 'Creates a new Fervor project.',
  },
  {
    name: 'migrate:latest',
    options: null,
    description: 'Runs all migrations',
  },
  {
    name: 'migrate:make',
    options: null,
    description: 'Creates a new migration',
  },
  {
    name: 'migrate:rollback',
    options: null,
    description: 'Rollback the last group of migrations',
  },
  {
    name: 'start',
    options: null, // can be an array of objects containing name and description
    description: 'Starts the full fervor prod server.',
  },
  {
    name: 'startDev',
    options: null, // can be an array of objects containing name and description
    description: 'Starts the fervor dev server. Run this while you are building your app to have hot reloading feature for client and server code.',
  },
  {
    name: 'startBackendOnly',
    options: null, // can be an array of objects containing name and description
    description: 'Starts a backend only server.',
  },
  {
    name: 'startDevBackendOnly',
    options: null, // can be an array of objects containing name and description
    description: 'Starts a backend only fervor dev server. Useful for quickly testing and developing server side code.',
  },
]);
