const { execSync } = require('child_process');
const defaults = require('lodash.defaults');
const fs = require('fs');
const glob = require('glob');
const makeDirSync = require('make-dir').sync;
const path = require('path');
const slash = require('slash');
const uniq = require('lodash/uniq');
const util = require('@babel/cli/lib/babel/util');

const babelrcHelper = require('../../config/babelrcHelper').default;

// Forked from babel-cli
/* eslint-disable no-restricted-syntax, no-await-in-loop, no-console */

function outputFileSync(filePath, data) {
  makeDirSync(path.dirname(filePath));
  fs.writeFileSync(filePath, data);
}

function getDest(filename, base, options) {
  if (options.settings.relative) {
    return path.join(base, options.settings.outDir, filename);
  }
  return path.join(options.settings.outDir, filename);
}
async function write(src, base, options) {
  let relative = path.relative(base, src);

  if (!util.isCompilableExtension(relative, options.settings.extensions)) {
    return false;
  }

  // remove extension and then append back on .js
  relative = util.adjustRelative(relative, options.settings.keepFileExtension);

  const dest = getDest(relative, base, options);

  try {
    const res = await util.compile(
      src,
      defaults(
        {
          sourceFileName: slash(path.relative(`${dest}/..`, src)),
        },
        options.babelOptions,
      ),
    );

    if (!res) return false;

    // we've requested explicit sourcemaps to be written to disk
    if (
      res.map &&
      options.babelOptions.sourceMaps &&
      options.babelOptions.sourceMaps !== 'inline'
    ) {
      const mapLoc = `${dest}.map`;
      res.code = util.addSourceMappingUrl(res.code, mapLoc);
      res.map.file = path.basename(relative);
      outputFileSync(mapLoc, JSON.stringify(res.map));
    }

    outputFileSync(dest, res.code);
    util.chmod(src, dest);

    if (options.settings.verbose) {
      console.log(`${src} -> ${dest}`);
    }

    return true;
  } catch (err) {
    throw err;
  }
}

async function handleFile(src, base, options) {
  const written = await write(src, base, options);

  if (!written && options.settings.copyFiles) {
    const filename = path.relative(base, src);
    const dest = getDest(filename, base, options);
    outputFileSync(dest, fs.readFileSync(src));
    util.chmod(src, dest);
  }
  return written;
}

async function handle(filenameOrDir, options) {
  if (!fs.existsSync(filenameOrDir)) return 0;

  const stat = fs.statSync(filenameOrDir);

  if (stat.isDirectory()) {
    const dirname = filenameOrDir;

    let count = 0;

    const files = util.readdir(dirname, options.settings.includeDotfiles);
    for (const filename of files) {
      const src = path.join(dirname, filename);

      const written = await handleFile(src, dirname, options);
      if (written) count += 1;
    }

    return count;
  }

  const filename = filenameOrDir;
  const written = await handleFile(filename, path.dirname(filename), options);

  return written ? 1 : 0;
}


module.exports = async ({
  directory = process.cwd(),
  webpack = path.join(directory, 'node_modules', 'webpack-cli', 'bin', 'cli.js'),
  isIntegrationTest = false,
}) => {
  // build for server, using babel
  const babelOptions = babelrcHelper(true, directory, true);

  let filenames = glob.sync(path.join(directory, 'src'));
  filenames = uniq(filenames);

  const buildOptions = {
    settings: {
      relative: false,
      includeDotfiles: true,
      copyFiles: true,
      extensions: ['.es6', '.js', '.es', '.jsx', '.mjs'],
      keepFileExtension: false,
      quiet: false,
      filenames,
      outDir: path.join(directory, 'build'),
    },
    babelOptions,
  };

  makeDirSync(buildOptions.settings.outDir);
  let compiledFiles = 0;

  for (const filename of buildOptions.settings.filenames) {
    compiledFiles += await handle(filename, buildOptions);
  }
  if (!buildOptions.settings.quiet) {
    console.log(
      `Successfully compiled ${compiledFiles} ${
        compiledFiles !== 1 ? 'files' : 'file'
      } with Babel.`,
    );
  }

  // build for web, using webpack
  const webpackConfig = path.join(__dirname, '../../../lib', 'config', 'webpack.prod.js');
  const testEnv = (isIntegrationTest) ? 'integration' : 'null';
  execSync(`cd ${directory}; TEST_ENV=${testEnv} ${webpack} --config ${webpackConfig}`, { stdio: [0, 1, 2] });
};
