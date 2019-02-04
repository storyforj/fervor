import { Pool } from 'pg';
import { parse as parsePgConnectionString } from 'pg-connection-string';

let pool;

export const createPgPool = (options, pgqlOpts) => {
  let pgConnectionString = options.db;
  if (process.env.DATABASE_USE_SSL === 'true') {
    if (pgConnectionString.indexOf('?') > -1) {
      pgConnectionString += '&ssl=true';
    } else {
      pgConnectionString += '?ssl=true';
    }
  }

  pool = new Pool({
    ...parsePgConnectionString(pgConnectionString),
    max: pgqlOpts.maxPoolSize || 10,
    idleTimeoutMillis: 500,
  });

  return pool;
};

export const getPgPool = () => pool;
