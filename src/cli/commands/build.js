const { execSync } = require('child_process');
const path = require('path');

module.exports = ({
  directory = process.cwd(),
  fervorDir = path.join(directory, 'node_modules', 'fervor'),
  babel = path.join(directory, 'node_modules', 'babel-cli', 'bin', 'babel.js'),
  webpack = path.join(directory, 'node_modules', 'webpack', 'bin', 'webpack.js'),
}) => {
  // build for server, using babel
  const srcFolder = path.join(directory, 'src');
  const builtFolder = path.join(directory, 'build');
  const babelrcFervor = path.join(fervorDir, '.babelrc');
  const babelrcSrc = path.join(directory, '.babelrc');
  execSync(`cp ${babelrcFervor} ${babelrcSrc}`);
  execSync(`${babel} ${srcFolder} -d ${builtFolder}`);
  execSync(`rm ${babelrcSrc}`);

  // build for web, using webpack
  const webpackConfig = path.join(__dirname, '../../../lib', 'config', 'webpack.prod.js');
  execSync(`cd ${directory}; ${webpack} --config ${webpackConfig}`);
};
