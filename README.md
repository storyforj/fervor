Fervor
----

*Current status*: Building core functionality
*Example Project*: https://github.com/fervorous/goalboard

A batteries included fullstack framework to build modern apps and progressive web apps.

Feature (so far):
----

1. Universal React
2. Auto generated GraphQL based on your postgres schema
3. Server and client rendered GraphQL
4. CSS Modules
5. Hot reloading

How to develop?
---

1. create a database in postgres, copy the migration from the example project and run it
2. add a couple rows in the db for the person table
3. Clone both this repo and the example project
4. `yarn install` in both
5. `yarn link` in the fervor directory
6. `yarn link fervor` in the example project directory
7. run `node_modules/.bin/fervor` or `node_modules/.bin/fervor-debug` in the example app
