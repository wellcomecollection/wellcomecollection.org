# wellcomecollection.org

[![Join the chat at https://gitter.im/wellcometrust/wellcomecollection.org](https://badges.gitter.im/wellcometrust/wellcomecollection.org.svg)](https://gitter.im/wellcometrust/wellcomecollection.org?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

The thing that makes the Wellcome Collection available to the public.

## Requirements

* [Node](https://nodejs.org/en/download/) (or use [NVM](https://github.com/creationix/nvm))


The project is split into multiple services, follow the `README`s within each project to get started.

* [client](./client)
  Static assets such as SASS, JS, fonts etc. Responsible for their compilation.

* [server](./server)
  Runs the server that returns the HTML templates, components and Fractal styleguide

* [infra](./infra)
  Managing our infrastructure within AWS

## Editor settings

Be aware that the Sass (`.stylelintrc`) and JS (`.eslintrc.json`) lint config files – and their node module dependencies – are contained within the `client` directory. You should configure your editor to resolve the correct node modules path in order for linting to work with your editor open at the root of the project.

