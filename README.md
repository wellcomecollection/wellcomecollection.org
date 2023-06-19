Just a change to trigger a new PR

# Wellcome Collection

Wellcome Collection web applications.

[![Build status](https://badge.buildkite.com/0ca819db1215b66ecb17019d8ee5331d8e537094d051141219.svg?branch=main)](https://buildkite.com/wellcomecollection/experience) [![Deployment status](https://img.shields.io/buildkite/35f01a7d794772ab5d19c8cb992751d18a87b54d8e6feb3ca4/main.svg?label=deployment)](https://buildkite.com/wellcomecollection/experience-deployment) [![e2e](https://img.shields.io/buildkite/cbb157a7255a4022f64a56252b99b0ebca088fb2eded1489be/main.svg?label=e2e%20tests)](https://buildkite.com/wellcomecollection/experience-e2e)

We all work in the **open** and **open source** where we can and where it makes sense

We put **users** **at the centre** of all decisions. We use **evidence and insight** to inform these decisions at all stages of the product cycle

We create **simple**, **well considered experiences**, frequently incorporating **user feedback**

We have **inclusive processes** that create **accessible products**

We build products that **deliver value**, **solve real problems**, and are a **delight to use**

## Visual design

Visual design for the experience is created in [Sketch](https://www.sketch.com/) and shared via [Zeplin](https://app.zeplin.io/).

To get a login, ask a friendly experience team member near you.

## Core parts

### [Content](https://wellcomecollection.org/stories)

- A collection of content from a wide range of authors to challenge the
  ways people think and feel about health by connecting science, medicine,
  life and art [`code`](./content).

- Giving people the ability to partake in or inform themselves on
  Wellcome Collection's events, exhibitions, talks,
  discussions, and more.

### [Catalogue](https://wellcomecollection.org/works)

- Tools to allow people to browse and dig deeper into our catalogue.
  [`code`](./catalogue).

### [Cardigan](https://cardigan.wellcomecollection.org)

- Wellcome Collection's design system. [`code`](./cardigan).

## Local development

We use [Yarn](https://yarnpkg.com/lang/en/) to manage our external dependencies.

We then use [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) to manage our [local, common dependencies](https://github.com/wellcomecollection/wellcomecollection.org/tree/main/common).

To run a project, from the root directory:
```bash
yarn install
# yarn {appName = content|catalogue|identity}
# e.g.
yarn catalogue
# you may also run all of them concurrently.
# this may add a prefix to the URL such as `/catalogue/`
# and is only for local cross projects development
yarn run-concurrently
```
### Port
By default webapps will run on port `3000`.

You can specify a port by setting the `PORT` in your `.env.development`.

This is useful if you want to run webapps simultaneously, or you may just use `yarn run-concurrently` as explained above.

### Running CI steps locally

In order to reproduce a build step locally you can run the same `docker-compose` command that [Buildkite](https://buildkite.com/wellcomecollection/experience) runs.

See an example for `edge_lambdas` below. This example presumes you have an AWS credentials file set up to allow you to assume the CI role.

Your AWS configuration in `$HOME/.aws/credentials` might include the following (with the default profile containing your primary credentials).

```
[ci-agent]
region=eu-west-1
role_arn=arn:aws:iam::760097843905:role/ci-agent
source_profile=default

[experience-ci]
region=eu-west-1
role_arn=arn:aws:iam::130871440101:role/experience-ci
source_profile=ci-agent
```

If in [`pipeline.yml`](.buildkite/pipeline.yml) you have:

```yaml
- label: "deploy edge_lambdas"
  if: build.branch == "main"
  plugins:
    - wellcomecollection/aws-assume-role#v0.2.2:
        role: "arn:aws:iam::130871440101:role/experience-ci"
    - ecr#v2.1.1:
        login: true
    - docker-compose#v3.5.0:
        run: edge_lambdas
        command: [ "yarn", "deploy" ]
        env:
          - AWS_ACCESS_KEY_ID
          - AWS_SECRET_ACCESS_KEY
          - AWS_SESSION_TOKEN
```

You should update [`docker-compose.yml`](docker-compose.yml) to look as follows.

```yaml
services:
  edge_lambdas:
    build:
      context: ./cache/edge_lambdas
    command: [ "yarn", "deploy" ]
    volumes:
      - /my/home/folder/.aws:/root/.aws:ro
    environment:
      - AWS_PROFILE=experience-ci
```

You will need to add a `command`, `volumes` and `environment` block to specify the required command and mount your AWS credentials in the running container.

You can then run `docker-compose` commands as would occur in the CI environment.

```shell script
docker-compose edge_lambdas build
docker-compose edge_lambdas run
```

## Linting

We use [`ESLint`](https://eslint.org/) to lint the project. [The config is global](./eslintrc.js).

We use [`stylelint`](https://stylelint.io/) to lint styled-components.  [The config is global](./.stylelintrc.js).

We extend a few configs, including prettier, [which we configure separately](./prettierrs.js).

### VSCode setup

It's easiest to use [Dirk Baumer's VSCode plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

If you have prettier (`esbenp.prettier-vscode`) set as default formatter, we'll get conflicts.

Linting does not happen in CI, so to enable linting on save, you can add this to your workspace settings:
```JSON
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "stylelint.validate": ["typescriptreact"],
}
```

## Other pieces of the Wellcome Collection puzzle

[Wellcome Collection Digital Platform](https://github.com/wellcomecollection/platform).

[Stacks](https://stacks.wellcomecollection.org/), Wellcome Collection's musings on digital developments.

[Catalogue API documentation](https://developers.wellcomecollection.org).

## Thanks

<a href="https://www.chromatic.com/"><img src="https://user-images.githubusercontent.com/321738/84662277-e3db4f80-af1b-11ea-88f5-91d67a5e59f6.png" width="153" height="30" alt="Chromatic" /></a>

Thanks to [Chromatic](https://www.chromatic.com/) for providing the visual testing platform that helps us review UI changes and catch visual regressions.
