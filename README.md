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
8. Service Worker Caching
9. Progressive Web App Ready

How to Start
----

### Pre-requisites

1. PostgreSQL installed and running ([OSX guide](https://www.codementor.io/devops/tutorial/getting-started-postgresql-server-mac-osx), [Linux guide](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04))
2. NodeJS installed - take a look at [NVM](https://github.com/creationix/nvm)
3. Optionally - [Install Yarn](https://yarnpkg.com/en/docs/install)

### Create a new app

1. `yarn global add fervor`
2. `fervor create [your app name]; cd [your app name]`
3. `yarn install`
4. Create a database (`createdb [appname]`), or update the .env file
5. `yarn start:dev`

Note - `fervor create` will create an app in the current directory, and use the current directory name as the name of the app.

### Some next steps

- Create some migrations using `fervor migrate:make [migration name]`
- Run the migrations using `fervor migrate:latest`, rollback using `fervor migrate:rollback`
- Have some fun with your auto generated graphql. Inspect by visiting `http://localhost:3000/admin/graphiql`
- Write some React components, and make your app look great!
- Deploy to heroku copying `app.json` from our example app. Also copy the heroku prebuild step from package.json
- Try out the production build locally by running `yarn build; yarn start:prod`

Contributors
----

Your name could be here too! Read CONTRIBUTING.md for more details

[<img alt="parris" src="https://avatars0.githubusercontent.com/u/202664?v=4&s=117" width="117">](https://github.com/parris)
