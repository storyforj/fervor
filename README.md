![Build Status](https://circleci.com/gh/fervorous/fervor.svg?style=shield)

Fervor
----

*Current status*: Building core functionality

*TodoMVC Example*: https://github.com/fervorous/fervor-todo-mvc

A batteries included fullstack framework to build modern, progressive web apps.

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
