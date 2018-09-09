const fs = require('fs');

export default (appLocation) => (
  fs.existsSync(`${appLocation}/src/graph/client.js`)
);
