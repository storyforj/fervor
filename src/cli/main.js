const runCommands = require('./utils/runCommands');

runCommands([
  {
    name: 'build',
    options: null, // can be an array of objects containing name and description
    description: 'Creates a built version of the app for web/node use.',
  },
  {
    name: 'startDev',
    options: null, // can be an array of objects containing name and description
    description: 'Starts the fervor dev server. Run this while you are building your app to have hot reloading type features.',
  },
]);
