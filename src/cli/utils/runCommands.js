/* eslint-disable global-require, import/no-dynamic-require */

const args = require('minimist')(process.argv.slice(2));

module.exports = async (docs) => {
  const command = args._[0];

  if (command === 'help') {
    await require('./help')(docs, args);
  } else {
    await require(`../commands/${command}`)(args);
  }
};
