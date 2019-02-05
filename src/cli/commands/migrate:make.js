const { execSync } = require('child_process');
const path = require('path');

module.exports = (args) => {
  let today = (new Date()).toISOString().replace('T', '').replace('Z', '').replace(/-/g, '').replace(/:/g, '').replace('.', '');
  today = today.substring(0, today.length - 7);
  const random = Math.floor(1000 + (Math.random() * 9000));

  const fileName = `${today}${random}_${args._[1]}.js`;
  const destination = path.join(process.cwd(), 'src', 'migrations', fileName);
  const source = path.join(__dirname, '..', '..', 'templates', 'migration.js');

  execSync(`cp ${source} ${destination}`);
};
