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
    description: 'Starts the fervor prod server.',
  },
  {
    name: 'startDev',
    options: null, // can be an array of objects containing name and description
    description: 'Starts the fervor dev server. Run this while you are building your app to have hot reloading type features.',
  },
]);
