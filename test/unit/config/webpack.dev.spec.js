import fs from 'fs';
import path from 'path';
import webPackDevConfig from '../../../src/config/webpack.dev';

let pluginCount;

describe('Webpack Dev Config, without a custom config', () => {
  it('returns a config', async () => {
    webPackDevConfig(
      { use: () => {} },
      {
        appLocation: __dirname,
        webpackMiddleware: (cfg) => {
          expect(typeof cfg.dev).toBe('object');
          expect(typeof cfg.config).toBe('object');
          pluginCount = cfg.config.plugins.length;
        },
      },
    );
  });
});

describe('Webpack Dev Config, with a custom config', () => {
  beforeEach(() => {
    fs.writeFileSync(
      path.join(__dirname, 'src', 'config', 'webpack.js'),
      `
        import CopyPlugin from 'copy-webpack-plugin';

        export default (config) => {
          config.plugins.push(CopyPlugin([]));
          return config;
        };
      `);
  });

  afterEach(() => {
    fs.unlinkSync(path.join(__dirname, 'src', 'config', 'webpack.js'));
  });

  it('returns a config', async () => {
    webPackDevConfig(
      { use: () => {} },
      {
        appLocation: __dirname,
        webpackMiddleware: (cfg) => {
          expect(cfg.config.plugins.length).toBe(pluginCount + 1);
        },
      },
    );
  });
});
