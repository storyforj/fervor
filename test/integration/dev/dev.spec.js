import { expect } from 'chai';
import path from 'path';
import dotenv from 'dotenv';
import startApp from '../../../src/server/server';
import superagent from 'superagent';

describe('Dev server', function() {
  before(async () => {
    dotenv.config({ path: path.join(process.cwd(), 'test', 'integration', 'dev', 'testApp', '.env') });
    const routes = require(`${process.cwd()}/test/integration/dev/testApp/apps/__routes`).default;
    await startApp({
      appName: process.env.APP_NAME,
      db: process.env.DATABASE_URL,
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
    expect(
      browser.getCssProperty('div[class*="component"]', 'background').value
    ).to.contain('rgb(0,0,0)');
    expect(
      browser.getCssProperty('div[class*="component"]', 'color').value
    ).to.contain('rgba(255,255,255,1)');
  });
});
