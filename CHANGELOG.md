# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.1.1] - 2019-02-16
Fixed bugs with redux routing middleware by upgrading the dependency.

### Changed
- Upgraded from react-router-redux to connected-router-redux for more stability
- Cleaned up some old redux routing code

## [2.1.0] - 2019-02-15
Improve dynamic routing + optimize route rendering

### Changed
- Routes now render using PureComponents for better accuracy
- Routes also render using the render method supplied by React Router. This means, we can better support dynamic routing.
- Changed caching of Javascript modules. Previousl we only cached the first module loaded on the page.
  We now cache all modules. This helps with subsequent loads of the same module. This in addition, helps
  render SPAs.

## [2.0.2] - 2019-02-05
Small bug fix. We changed the load order of .env.personal and .env. .env.personal should
override .env.

### Changed
- .env.personal now overrides .env

## [2.0.0] - 2019-02-04
Lots of dev experience, error/loading state improvements and performance improvements.
In addition, we now support newer versions of Node. Currently tested using Node 11.

### Changed
- Server side graphql calls are now resolved without a round trip
- We changed the way URLs are registered. We now using dynamic import statements. Dynamic
  imports can be used anywhere in the app now!
- Upgraded to Babel 7
- Upgraded Webpack
- Upgrade React to latest (16.7.0)
- Upgraded Apollo to latest
- Upgraded SCSS/CSS loaders and friends
- Upgraded wdio for more stable acceptance tests within Fervor
- Customized the template for migrations
- Fixed a bug where we pointing to built backend folders even in development

### Added
- Dynamic imports (server and client compatible)
- Decorators
- Minimal Pipeline operator
- Global Loading, 404 and 500 error pages

### Removed
- Reliance on the "make-lazy" Babel plugin (internal to Fervor)

## [1.5.0] - 2018-12-20
Small change - allowed for adding content to the end of the document HEAD via the rendering.js file. This let's us avoid FOUC.

## [1.4.0] - 2018-11-16
The main catalyst for the release was to update Postgraphile in order to get:
1) speed improvements
2) enhanced functionality around custom resolvers

### Changed
- Upgraded postgraphile, koa, react and friends. These changes should result in no breaking changes.

## [1.3.0] - 2018-09-21
### Added
- Support to change publicPath in prod. This allows for the ability to have remote static assets.
- Better production build logging

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
