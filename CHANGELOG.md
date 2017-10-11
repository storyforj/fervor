# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
