Fervor
----

[![Join the chat at https://gitter.im/fervorous/fervor](https://badges.gitter.im/fervorous/fervor.svg)](https://gitter.im/fervorous/fervor?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) ![Build Status](https://circleci.com/gh/fervorous/fervor.svg?style=shield)

![Fervor Logo](https://avatars2.githubusercontent.com/u/26048760?v=4&u=c900b5463478aa9e8937a8422721210d33a9b984&s=200)

**Example App**: https://github.com/fervorous/fervor-todo-mvc

A batteries included, config free, fullstack framework to build modern web apps. Just write your data migrations, throw some components together and we'll handle the rest. We know you want universal rendering, we know you want to *own* your own data, we know you don't really want to write your own APIs that just move some data from one place to another. We've automated all that away, integrated with all the best libraries in the node community.

Major Features:
----

1. Universal React
2. Auto generated GraphQL based on your Postgres schema
3. Data Migrations
3. Server and client rendered GraphQL
5. CSS Modules
6. Hot reloading
7. CLI
8. Service Workers (WIP)

How to Start
----

Docs and some more CLI tools are in progress, but here's how you can get started right now.

Pre-requisites: postgres installed and running, nodejs installed, and yarn or npm installed

1. `yarn global add fervor` or `npm install -g fervor`
2. `fervor create --directory [your app name]` or `fervor create`, which will create an app in the current directory.
3. `cd [your app name]`
4. `yarn install` or `npm install`
5. Make sure you update .env with the name of your database, you can create one by typing `createdb [appname]`
6. `yarn start:dev` or `npm start:dev`

### Some next steps

- Create some migrations using `fervor migrate:make`
- Run the migrations using `fervor migrate:latest`
- Have some fun with your auto generated graphql.
- Write some react components
- Deploy to heroku copying `app.json` from our example app. Also copy the heroku prebuild step from package.json

Contributors
----

Your name could be here too! Read CONTRIBUTING.md for more details

[<img alt="parris" src="https://avatars0.githubusercontent.com/u/202664?v=4&s=117" width="117">](https://github.com/parris)
