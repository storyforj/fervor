import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import createApp from '../../../src/cli/commands/create';

describe('Create App CLI', () => {
  beforeEach(() => {
    createApp({ directory: path.join('test', 'unit', 'cli', 'build', 'testDir') });
  });

  afterEach(() => {
    // comment out the line below when you're trying to debug tests
    // note - jest will complain on 2nd run, this is ok though.
    rimraf.sync(path.join(__dirname, 'build'));
  });

  it('copies all the files from the template', () => {
    expect(
      fs.statSync(path.join(__dirname, 'build', 'testDir', '.env')).isFile(),
    ).toBeTruthy();
    expect(
      fs.statSync(path.join(__dirname, 'build', 'testDir', '.eslintrc')).isFile(),
    ).toBeTruthy();
    expect(
      fs.statSync(path.join(__dirname, 'build', 'testDir', '.gitignore')).isFile(),
    ).toBeTruthy();
    expect(
      fs.statSync(path.join(__dirname, 'build', 'testDir', 'package.json')).isFile(),
    ).toBeTruthy();

    expect(
      fs.statSync(path.join(__dirname, 'build', 'testDir', 'src', 'apps', 'styles', 'about.scss')).isFile(),
    ).toBeTruthy();
    expect(
      fs.statSync(path.join(__dirname, 'build', 'testDir', 'src', 'apps', 'About.js')).isFile(),
    ).toBeTruthy();
    expect(
      fs.statSync(path.join(__dirname, 'build', 'testDir', 'src', 'components', 'styles', 'template.scss')).isFile(),
    ).toBeTruthy();
    expect(
      fs.statSync(path.join(__dirname, 'build', 'testDir', 'src', 'components', 'Template.js')).isFile(),
    ).toBeTruthy();
    expect(
      fs.statSync(path.join(__dirname, 'build', 'testDir', 'src', 'migrations', '__empty__')).isFile(),
    ).toBeTruthy();
    expect(
      fs.statSync(path.join(__dirname, 'build', 'testDir', 'src', 'urls.js')).isFile(),
    ).toBeTruthy();

    expect(
      fs.statSync(path.join(__dirname, 'build', 'testDir', 'assets', 'icon_32x32.png')).isFile(),
    ).toBeTruthy();
    expect(
      fs.statSync(path.join(__dirname, 'build', 'testDir', 'assets', 'icon_512x512.png')).isFile(),
    ).toBeTruthy();
  });

  it('replaces [appname] from every file', () => {
    const buildDir = path.join(__dirname, 'build');
    let noMatches = false;
    try {
      execSync(`grep -rl "appname" ${buildDir}`);
    } catch (e) {
      noMatches = true;
    }

    expect(noMatches).toBeTruthy();
  });
});
