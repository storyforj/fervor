const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const babelrcHelper = require('../../config/babelrcHelper').default;

module.exports = ({
  directory = process.cwd(),
  babel = path.join(directory, 'node_modules', '@babel/cli', 'bin', 'babel.js'),
}) => {
  // build for server, using babel
  const srcFolder = path.join(directory, 'src');
  const builtFolder = path.join(directory, 'build');
  const babelrcSrc = path.join(directory, '.babelrc');
  const config = babelrcHelper(true, directory, true);

  fs.writeFileSync(babelrcSrc, JSON.stringify(config), 'utf8');
  execSync(`${babel} ${srcFolder} -d ${builtFolder} --copy-files`, { stdio: [0, 1, 2] });
  execSync(`rm ${babelrcSrc}`);
};
