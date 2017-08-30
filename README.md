![Build Status](https://circleci.com/gh/fervorous/fervor.svg?style=shield)

Fervor
----

*TodoMVC Example*: https://github.com/fervorous/fervor-todo-mvc

A batteries included, config free, fullstack framework to build modern web apps. Just write your data migrations, throw some components together and we'll handle the rest. We know you want universal rendering, we know you want to *own* your own data, we know you don't really want to write your own APIs that just move some data from one place to another. We've automated all that away, integrated with all the best libraries in the node community. Now all you need to do is solve some killer world problem.

Features (so far):
----

1. Universal React
2. Auto generated GraphQL based on your postgres schema
3. Server and client rendered GraphQL
4. CSS Modules
5. Hot reloading
6. Migrations
7. CLI
8. Offline requests via Service Workers

How to contribute?
---

1. Create a database called 'example' and 'example_test' in postgres
2. Clone this repo
3. `yarn install`
4. You can use unit tests and integration tests to simulate prod vs dev

Note - for integration tests you'll need Java. The test runner will auto-setup selenium though.

### Testing with the Example Repo

1. Clone the example repo - https://github.com/fervorous/fervor-todo-mvc
2. `yarn install` in the example repo, and this repo
3. `yarn link` in the fervor directory, `yarn link fervor` in the example project directory
4. `fervor migrate:latest` in the example project
5. `yarn build; yarn start:prod` or `yarn start:dev` depending if you're trying to test prod or dev.

Note - everytime you install a dependency in fervor, you'll need to do all of the above, and maybe `rm -rf node_modules` in the example project. This is unfortunate, but somewhat required due the way we're trying to bootstrap applications. Does anyone have ideas to improve this?
