# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2018-09-09
### Added
- Apollo link state - the file src/graph/client.js and folder src/graph/client are now reserved for client side
  state management via apollo link state. See the "Client State" wiki page for more details
### Changed
- A refactor of the form component to prevent HOC re-rendering issues
- Upgraded React/Apollo and friends

## [1.1.0] - 2018-06-02
### Added
- Added react-helmet and our "Meta" facade for it. You can now use it as superior alternative to our original "Document" component.
- Titles are now renderable server side :boom:
- All meta data on the page is editable
### Changed
- Our "Document" component is deprecated and will be removed in the future
### Removed
- IMPORTANT (breaking change): We no longer automatically add the "viewport" meta tag. If you were using this previously you should manually add it to your site. You can add it like this in your templates or for any app.
  <Meta>
    <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1" />
  </Meta>

## [1.0.1] - 2018-05-15
### Changed
- Use style-loader again for dev
- Removed a double invocation of hot-module-loading
- Upgrade webpack css loaders
- Merged all .scss files again

## [1.0.0] - 2018-04-06
### Added
- Server side hot reload - you no longer need to restart the server in dev as frequently
- Exposed Apollo 2's Query and Mutation components
### Changed
- Upgraded to webpack 4 - IMPORTANT: If you made a custom webpack config, you'll need to change it
- Upgraded to apollo 2 while maintaining backwards compatibility with old apps
- Upgraded every package to the latest builds
- Replaced webpack-text-extract-plugin for mini-css-extract-plugin
- Webpack 4 chunking/optimizations have now taken over for the most part
### Removed
- Support for NPM is flakey, please use yarn for now

## [0.7.2] - 2017-11-16
### Added
- Experimental - Added processCSS, processJS and processMeta rendering config options

## [0.7.1] - 2017-11-16
### Added
- Experimental - Added SSL DB connection option

## [0.7.0] - 2017-11-12
### Added
- Added the ability to add wrappers around client/server side App components

### Changed
- Updated React and friends

## [0.6.2] - 2017-11-07
### Changed
- Bumped the postgraphile version

## [0.6.1] - 2017-11-04
### Removed
- Removed .css extension from the build system - decided that this was a bad idea. Most packages export css and this will change how they opperate.

## [0.6.0] - 2017-11-04
### Added
- Added code splitting at the route level
- Add .css extension to babel and webpack

### Changed
- Fixed cli help command formatting

## [0.5.8] - 2017-10-14
### Changed
- Fixed security issue

## [0.5.7] - 2017-10-10
### Added
- Since 0.5.0 we've improved Forms a-lot. This release continues improvemenets. redirectTo in particular is really usefule for leading from 1 gql form to the next page.
- Ability to use template strings for redirectTo
- Disabled "no-template-curly-in-string" from default eslint. This was done in order to support template strings for redirectTo

## [0.5.0] - 2017-09-27
### Added
- Overridable babel configs
- Added a "graph" folder. This let's you add graphile plugins, or modify the postgraphql middleware.

## Changed
- Upgraded to react-16
- Upgraded to babel-preset-env
- appmanifest.json is now required and created with the app. If anyone out there is having trouble. Please add this file https://github.com/fervorous/fervor/blob/ec7186adf93bf879b91a44c957565e39166e1c76/src/templates/newApp/src/config/appmanifest.json to your src/config folder
- You can now remove both postgraphqlOpts and manifest settings from your .env file
- Also - deduped a lot of babel config code

## [0.4.0] - 2017-09-26
### Added
- Overridable webpack config
- Middleware is now configurable
