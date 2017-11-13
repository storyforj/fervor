const fs = require('fs');

export default (appLocation, configName) => (
  fs.existsSync(`${appLocation}/src/config/${configName}.js`) ||
  fs.existsSync(`${appLocation}/src/config/${configName}/index.js`)
);
