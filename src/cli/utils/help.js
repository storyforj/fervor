/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

module.exports = (commands, args) => {
  let isValidCommand = false;

  try {
    isValidCommand = fs.statSync(
      path.join(__dirname, '..', 'commands', `${args._[1]}.js`),
    ).isFile();
  } catch (e) {
    isValidCommand = false;
  }

  // If the user is looking for help on a specific command, and it actually exists
  if (
    args._[1] && isValidCommand
  ) {
    const command = commands.find((cmd) => cmd.name === args._[1]);
    let options = '';
    if (command.options && command.options.length) {
      options = `

  Options:

  ${command.options.map((opt) => (
  `  --${opt.name} - ${opt.description}`
  )).join('\n  ')}`;
    }

    console.log(`
  Welcome to Fervor

  Here's more info about the "${command.name}" command.

  ${command.name} - ${command.description}${options}
`);
  } else if (args._[1]) {
    console.log('Fervor - Invalid command. Type `fervor help` for more info.');
  } else {
    console.log(`
  Welcome to Fervor

  Here's what you can do:

  ${commands.map((cmd) => (
    `${cmd.name} - ${cmd.description}`
  )).join('\n  ')}

`);
  }
};
