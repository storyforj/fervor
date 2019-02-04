const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const babelrcHelper = require('../../config/babelrcHelper').default;

module.exports = ({
  directory = process.cwd(),
  babel = path.join(directory, 'node_modules', '@babel/cli', 'bin', 'babel.js'),
  webpack = path.join(directory, 'node_modules', 'webpack-cli', 'bin', 'cli.js'),
  isIntegrationTest = false,
}) => {
  // build for server, using babel
  const srcFolder = path.join(directory, 'src');
  const builtFolder = path.join(directory, 'build');
  const babelrcSrc = path.join(directory, '.babelrc');
  const config = babelrcHelper(true, directory, true);

  fs.writeFileSync(babelrcSrc, JSON.stringify(config), 'utf8');
  execSync(`${babel} ${srcFolder} -d ${builtFolder} --copy-files`, { stdio: [0, 1, 2] });
  execSync(`rm ${babelrcSrc}`);

  // build for web, using webpack
  const webpackConfig = path.join(__dirname, '../../../lib', 'config', 'webpack.prod.js');
  const testEnv = (isIntegrationTest) ? 'integration' : 'null';
  execSync(`cd ${directory}; TEST_ENV=${testEnv} ${webpack} --config ${webpackConfig}`, { stdio: [0, 1, 2] });
};
