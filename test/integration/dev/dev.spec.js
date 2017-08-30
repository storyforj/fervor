import { expect } from 'chai';
/* globals before, browser */
import path from 'path';
import dotenv from 'dotenv';
import superagent from 'superagent';
import startApp from '../../../src/server/server';

describe('Dev server', () => {
  before(async () => {
    dotenv.config({ path: path.join(process.cwd(), 'test', 'integration', 'dev', 'testApp', '.env') });
    // eslint-disable-next-line
    const routes = require(`${process.cwd()}/test/integration/dev/testApp/src/urls`).default;
    await startApp({
      appName: process.env.APP_NAME,
      db: process.env.DATABASE_URL_TEST,
      host: process.env.HOST || 'http://localhost:3001',
      port: process.env.PORT || 3001,
      appLocation: path.join(process.cwd(), 'test', 'integration', 'dev', 'testApp'),
      routes,
    });
  });

  it('renders server side', async () => {
    const response = await superagent.get('http://localhost:3001/');
    expect(response.text).to.contain('Hello World');
  });

  it('renders client side with CSS', () => {
    browser.url('http://localhost:3001/');
    browser.waitUntil(() => (
      browser
        .getCssProperty('div[class*="component"]', 'background')
        .value.indexOf('rgb(0,0,0)') >= -1
    ), 10000);
    browser.waitUntil(() => (
      browser
        .getCssProperty('div[class*="component"]', 'color')
        .value.indexOf('rgba(255,255,255,1)') >= -1
    ), 10000);
  });
});
