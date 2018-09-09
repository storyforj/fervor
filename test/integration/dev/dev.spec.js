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
      host: 'http://localhost:3002',
      port: 3002,
      appLocation: path.join(process.cwd(), 'test', 'integration', 'dev', 'testApp'),
      routes,
    });
  });

  it('renders server side', async () => {
    const response = await superagent.get('http://localhost:3002/');
    expect(response.text).to.contain('Hello World');
  });

  it('renders client side with CSS', () => {
    browser.url('http://localhost:3002/');
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

  it('does not render any react warnings on startup', () => {
    browser.url('http://localhost:3002/');
    // wait until after the CSS is loaded
    browser.waitUntil(() => (
      browser
        .getCssProperty('div[class*="component"]', 'background')
        .value.indexOf('rgb(0,0,0)') >= -1
    ), 10000);
    expect(() => {
      browser.log('browser').forEach((logEntry) => {
        if (logEntry.level === 'WARNING' || logEntry.level === 'SEVERE') {
          throw new Error(`Log with ${logEntry.level} found`);
        }
      });
    }).to.throw();
  });

  it('renders custom middleware', async () => {
    const response = await superagent.get('http://localhost:3002/pizza');
    expect(response.text).to.contain('Pizza World');
  });

  it('takes advantage of a rendering wrapper', async () => {
    const response = await superagent.get('http://localhost:3002/');
    expect(response.text).to.contain('Test Wrapper');
    expect(response.text).to.contain('Additional Content');
    expect(response.text).to.contain('hello-js');
    expect(response.text).to.contain('hello-css');
    expect(response.text).to.contain('hello-meta');
  });

  it('has functioning async/await on the client side', () => {
    browser.url('http://localhost:3002/test');
    browser.waitForText('.test-button', 'hello');
    browser.click('.test-button');
    browser.waitForText('.test-button', 'world');
  });

  it('works with client resolvers', () => {
    browser.url('http://localhost:3002/counter');
    browser.waitForText('.counter-text', '0');
    browser.click('.counter-button');
    browser.waitForText('.counter-text', '1');
    browser.click('.counter-button');
    browser.waitForText('.counter-text', '2');
  });
});
