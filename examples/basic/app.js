import startApp from '../../lib/server';
import dotenv from 'dotenv'

dotenv.config({ path: `${__dirname}/.env` });

startApp({
    appName: process.env.APP_NAME,
    db: process.env.DATABASE_URL,
    host: process.env.HOST || 'http://localhost:3000',
    port: process.env.PORT || 3000,
});