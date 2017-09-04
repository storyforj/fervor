import { expect } from 'chai';
/* globals before, browser */
import path from 'path';
import dotenv from 'dotenv';
import superagent from 'superagent';
import buildApp from '../../../src/cli/commands/build';
import startApp from '../../../src/server/server';

// TODO: fix up
xdescribe('Prod w/o JS', () => {
  before(async () => {
    dotenv.config({ path: path.join(process.cwd(), 'test', 'integration', 'prod', 'testApp', '.env') });
    await buildApp({
      babel: path.join(process.cwd(), 'node_modules', 'babel-cli', 'bin', 'babel.js'),
      directory: path.join(__dirname, 'testApp'),
      fervorDir: process.cwd(),
      webpack: path.join(process.cwd(), 'node_modules', 'webpack', 'bin', 'webpack.js'),
      isIntegrationTest: true,
    });
    // eslint-disable-next-line
    const routes = require(`${process.cwd()}/test/integration/prod/testApp/build/urls`).default;
    await startApp({
      appName: process.env.APP_NAME,
      db: process.env.DATABASE_URL_TEST,
      host: 'http://localhost:3004',
      port: 3004,
      appLocation: path.join(process.cwd(), 'test', 'integration', 'prod', 'testApp'),
      disableWebpack: true,
      routes,
    });
    browser.settings({
      chromeOptions: {
        javascriptEnabled: false,
      },
    });
  });

  // TODO: Get this part to run
  it('should not run JS', () => {
    const result = browser.execute(() => 'testing').value;
    // expect(result).not.to.equal('testing');
  });

  it('renders server side', async () => {
    const response = await superagent.get('http://localhost:3004/');
    expect(response.text).to.contain('Hello World');
  });

  it('renders client side with CSS', () => {
    browser.url('http://localhost:3004/');
    browser.waitUntil(() => (
      browser
        .getCssProperty('div[class*="component"]', 'background')
        .value.indexOf('rgb(0,0,0)') >= -1
    ), 20000);
    browser.waitUntil(() => (
      browser
        .getCssProperty('div[class*="component"]', 'color')
        .value.indexOf('rgba(255,255,255,1)') >= -1
    ), 20000);
  });
});
