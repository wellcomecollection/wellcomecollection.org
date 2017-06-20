# wellcomecollection.org

The new home of the next.wellcomecollection.org website.

## Requirements

* [Node](https://nodejs.org/en/download/) (or use [NVM](https://github.com/creationix/nvm))


The project is split into multiple services, follow the `README`s within each project to get started.

* [client](./client)
  Static assets such as SASS, JS, fonts etc. Responsible for their compilation.

* [server](./server)
  Runs the server that returns the HTML templates, components and Fractal styleguide

* [nginx](./nginx)
  Used to have local copies of the site running over HTTPS and HTTP/2

* [infra](./infra)
  Managing our infrastructure within AWS

## Linting

If you're having troubled with your husky linting, you might not have your git hooks setup correctly.
You can rectify this by running:

  rm -rf .git/hooks && npm install husky

Be aware that the Sass (`.stylelintrc`) and JS (`.eslintrc.json`) lint config files – and their node module
dependencies – are contained within the `client` directory. You should configure your editor to resolve the correct node
modules path in order for linting to work with your editor open at the root of the project.
