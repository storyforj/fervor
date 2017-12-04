import { expect } from 'chai';
/* globals before, browser */
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import dotenv from 'dotenv';
import superagent from 'superagent';
import buildApp from '../../../src/cli/commands/build';
import startApp from '../../../src/server/server';

describe('Prod server', () => {
  before(async () => {
    rimraf.sync(path.join(__dirname, 'testApp', 'build'));
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
      host: 'http://localhost:3003',
      port: 3003,
      appLocation: path.join(process.cwd(), 'test', 'integration', 'prod', 'testApp'),
      disableWebpack: true,
      routes,
    });
  });

  it('renders server side', async () => {
    const response = await superagent.get('http://localhost:3003/');
    expect(response.text).to.contain('Hello World');
  });

  it('renders client side with CSS', () => {
    browser.url('http://localhost:3003/');
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
    browser.waitUntil(() => (
      browser
        .getCssProperty('body', 'background')
        .value.indexOf('rgba(0,255,0,1)') >= -1
    ), 20000);
  });

  it('respects the custom webpack config', () => {
    expect(
      fs.statSync(path.join(__dirname, 'testApp', 'build', 'test123.js')).isFile(),
    ).to.equal(true);
  });

  it('renders custom middleware', async () => {
    const response = await superagent.get('http://localhost:3003/pizza');
    expect(response.text).to.contain('Pizza World');
  });

  it('renders pwa html tags', async () => {
    const response = await superagent.get('http://localhost:3003/');
    expect(response.text).to.contain('<link href="/assets/icon_32x32.png" rel="apple-touch-icon-precomposed"');
    expect(response.text).to.contain('<link href="/assets/icon_32x32.png" rel="icon"');
    expect(response.text).to.contain('<meta name="theme-color" content="#FFD826"/>');
    expect(response.text).to.contain('<link rel="manifest" href="/appmanifest.json"/>');
  });

  it('renders appmanifest', async () => {
    const response = await superagent.get('http://localhost:3003/appmanifest.json');
    expect(response.text).to.contain('/assets/icon_32x32.png');
  });

  it('builds lazy loaded files', async () => {
    const manifestRaw = fs.readFileSync(path.join(__dirname, 'testApp', 'build', 'manifest.json'));
    const manifest = JSON.parse(manifestRaw);
    const jsFiles = Object.keys(manifest.jsChunks);
    expect(jsFiles.length).to.equal(5);
    expect(
      fs.statSync(path.join(__dirname, 'testApp', 'build', jsFiles[0])).isFile(),
    ).to.equal(true);
    expect(
      fs.statSync(path.join(__dirname, 'testApp', 'build', jsFiles[1])).isFile(),
    ).to.equal(true);
    expect(
      fs.statSync(path.join(__dirname, 'testApp', 'build', jsFiles[2])).isFile(),
    ).to.equal(true);
  });

  it('serves lazy loaded bundles', async () => {
    const manifestRaw = fs.readFileSync(path.join(__dirname, 'testApp', 'build', 'manifest.json'));
    const manifest = JSON.parse(manifestRaw);
    const jsFiles = Object.keys(manifest.jsChunks);
    const response1 = await superagent.get(`http://localhost:3003/build/${jsFiles[0]}`);
    expect(response1.statusCode).to.be.equal(200);
    const response2 = await superagent.get(`http://localhost:3003/build/${jsFiles[1]}`);
    expect(response2.statusCode).to.be.equal(200);
    const response3 = await superagent.get(`http://localhost:3003/build/${jsFiles[2]}`);
    expect(response3.statusCode).to.be.equal(200);
  });

  it('does not serve anything deeply nested in the build folder', async () => {
    try {
      const response = await superagent.get('http://localhost:3003/build/apps/Hello.js');
      expect(response.toString()).to.contain('Not Found');
    } catch (e) {
      expect(e.toString()).to.contain('Not Found');
    }
  });

  it('has functioning async/await on the client side', () => {
    browser.url('http://localhost:3003/test');
    browser.waitForText('.test-button', 'hello');
    browser.click('.test-button');
    browser.waitForText('.test-button', 'world');
  });
});
