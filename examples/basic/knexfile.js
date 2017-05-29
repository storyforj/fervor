const path = require('path');

if (!process.env.DATABASE_URL) {
    // eslint-disable-next-line global-require
    require('dotenv').config({ path: path.join(__dirname, '.env') });
}

module.exports = {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
        min: 2,
        max: 10,
    },
    migrations: {
        tableName: 'knex_migrations',
    },
};
