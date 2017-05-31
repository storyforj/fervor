import dotenv from 'dotenv';
import path from 'path';
import startApp from '../../lib/server';

import routes from './routes';

dotenv.config({ path: path.join(__dirname, '.env') });

startApp({
    appName: process.env.APP_NAME,
    db: process.env.DATABASE_URL,
    host: process.env.HOST || 'http://localhost:3000',
    port: process.env.PORT || 3000,
    appLocation: __dirname,
    routes,
});
