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

1. Create a database called 'example' in postgres
2. Clone both this repo and the example project
3. `yarn install` in both
4. `yarn link` in the fervor directory, `yarn link fervor` in the example project directory
5. `fervor migrate:latest` in the example project

Next you should decide if you're going to iterate on the prod setup or the dev setup.

6. `yarn build; yarn start:prod` or `yarn start:dev`
