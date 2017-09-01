Mission
----

In all things, Fervor aims to simplify software development. Developers using Fervor should be allowed to only think about the business logic of their systems. To achieve this, whenever possible, Fervor should only reveal just as much complexity as needed for the task the developer wants to achieve. We need not expose endless configuration files, or force people to know which versions of React work with which versions of React Router or Enzyme.

In the long run, we should take a "batteries are included but feel free to replace them" approach to building software. This methodology takes time, right now we're focusing on getting 1 tool chain right. Any opportunity we have to expand flexibility without causing the learning curve to start building with Fervor, we should take it!

Projects
----

Anyone is free to contribute in any way they feel. If you'd like tasks to be assigned to you, feel free to talk to us. If you want to solve a problem that is particularly troubling your workflow, feel free to open an issue to share intent about fixing it. Then feel free to pick the task up!

We use GitHub projects and issues right now for core contributors to decide what to build. We believe in Kanban, and being able to pull the next import task right off the top of the stack. We prioritize using [the RICE scoring system](https://blog.intercom.com/rice-simple-prioritization-for-product-managers/). We don't go too in depth with this right now. We may eventually attach a real score to every ticket; however, right now, we just perform a quick mental check against this equation `(Reach * Impact * Confidence) / Effort` for each task and stack rank it.

How to contribute?
----

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
