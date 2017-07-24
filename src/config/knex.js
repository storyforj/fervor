const path = require('path');

module.exports = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  directory: path.join(process.cwd(), 'src', 'migrations'),
});
