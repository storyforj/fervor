if (!process.env.DATABASE_URL) {
    require('dotenv').config({ path: `${__dirname}/.env` });
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
    }
};
