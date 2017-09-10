/* eslint-disable global-require, import/no-dynamic-require */
const args = require('minimist')(process.argv.slice(2));

module.exports = (docs) => {
  const command = args._[0];

  if (command === 'help') {
    require(`${__dirname}/help`)(docs, args);
  } else {
    require(`${__dirname}/../commands/${command}`)(args);
  }
};
