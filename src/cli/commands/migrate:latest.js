const dotenv = require('dotenv');
const path = require('path');

module.exports = () => {
  if (process.env.DISABLE_DOT_ENV !== 'true') {
    dotenv.config({ path: path.join(process.cwd(), '.env') });
  }
  // eslint-disable-next-line global-require
  const knex = require('../../config/knex');
  const directory = path.join(process.cwd(), 'src', 'migrations');
  knex.migrate.latest({ directory }).then(() => process.exit(0)).catch(() => process.exit(1));
};
