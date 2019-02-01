exports.config = {
  services: process.env.IS_CIRCLE_CI ? [] : ['selenium-standalone'], // ['sauce']

  specs: [
    './test/integration/**/*.spec.js',
  ],
  maxInstances: 1,
  capabilities: [{
    maxInstances: 5,
    browserName: 'chrome',
  }],
  sync: true,
  logLevel: 'error',
  coloredLogs: true,
  bail: 0,
  screenshotPath: './errorShots/',
  baseUrl: 'http://localhost:3001',
  waitforTimeout: 30000,
  timeout: 30000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    compilers: ['js:@babel/register'],
    timeout: 30000,
  },
  before() {
    // eslint-disable-next-line
    const chai = require('chai');
    global.expect = chai.expect;
    chai.Should();
    // eslint-disable-next-line
    require('isomorphic-fetch');
    // eslint-disable-next-line
    require('@babel/polyfill');
    // eslint-disable-next-line
    require('@babel/register')();
  },
};
