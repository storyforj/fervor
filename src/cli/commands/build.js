const { execSync } = require('child_process');
const path = require('path');

module.exports = () => {
  // build for server, using babel
  const babel = path.join(process.cwd(), 'node_modules', 'babel-cli', 'bin', 'babel.js');
  const srcFolder = path.join(process.cwd(), 'src');
  const builtFolder = path.join(process.cwd(), 'build');
  const babelrcFervor = path.join(process.cwd(), 'node_modules', 'fervor', '.babelrc');
  const babelrcSrc = path.join(process.cwd(), '.babelrc');
  execSync(`cp ${babelrcFervor} ${babelrcSrc}`);
  execSync(`${babel} ${srcFolder} -d ${builtFolder}`);
  execSync(`rm ${babelrcSrc}`);
  // build for web, using webpack
  const webpack = path.join(process.cwd(), 'node_modules', 'webpack', 'bin', 'webpack.js');
  const webpackConfig = path.join(__dirname, '../../../lib', 'config', 'webpack.prod.js');
  execSync(`${webpack} --config ${webpackConfig}`);
};
