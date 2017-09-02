const { execSync } = require('child_process');
const path = require('path');

module.exports = ({
  directory = false,
}) => {
  // note - tests depend on the directory option. Be really
  // careful when you're making a change again the non-directory variant
  const appName = directory.split(path.sep).pop() || process.cwd().split(path.sep).pop();
  let destinationFolder = process.cwd();
  const templateFolder = path.join(__dirname, '..', '..', 'templates', 'newApp');

  if (directory) {
    execSync(`mkdir -p ${directory}`);
    destinationFolder = path.join(process.cwd(), directory);
  }

  execSync(`cp -a ${templateFolder}/. ${destinationFolder}`);
  // the escaping around appname it isn't useless, it has a use while grepping, but not in JS
  // eslint-disable-next-line no-useless-escape
  execSync(`cd ${destinationFolder}; find ./ -type f -exec sed -i '' -e 's/\\[appname\\]/${appName}/g' {} \\;`);
};
