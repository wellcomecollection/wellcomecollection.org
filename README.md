# Wellcome Collection

Wellcome Collection web applications.

[![Build status](https://badge.buildkite.com/0ca819db1215b66ecb17019d8ee5331d8e537094d051141219.svg?branch=main)](https://buildkite.com/wellcomecollection/experience) [![Deployment status](https://img.shields.io/buildkite/35f01a7d794772ab5d19c8cb992751d18a87b54d8e6feb3ca4/main.svg?label=deployment)](https://buildkite.com/wellcomecollection/experience-deployment) [![e2e](https://img.shields.io/buildkite/cbb157a7255a4022f64a56252b99b0ebca088fb2eded1489be/main.svg?label=e2e%20tests)](https://buildkite.com/wellcomecollection/experience-e2e)

We all work in the **open** and **open source** where we can and where it makes sense

We put **users** **at the centre** of all decisions. We use **evidence and insight** to inform these decisions at all stages of the product cycle

We create **simple**, **well considered experiences**, frequently incorporating **user feedback**

We have **inclusive processes** that create **accessible products**

We build products that **deliver value**, **solve real problems**, and are a **delight to use**

## Visual design

Visual designs for the experience are created and shared in [Figma](https://figma.com).

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
  [`code`](./content).

### [Cardigan](https://cardigan.wellcomecollection.org)

- Wellcome Collection's design system. [`code`](./cardigan).

## Local development

You can run `./scripts/setup.sh` from the root of this project to install what you need to get started.

We use [Yarn](https://yarnpkg.com/lang/en/) to manage our external dependencies.

We then use [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) to manage our [local, common dependencies](https://github.com/wellcomecollection/wellcomecollection.org/tree/main/common).

To run a project, from the root directory:
```bash
yarn install
# yarn {appName = content|identity}
# e.g.
yarn content
```
### Running the app with local APIs

To run the app using a local copy of the concept, content, and/or catalogue APIs you can run:

```bash
yarn config-local-apis
```

Configure the content & identity app to use the local APIs under `https://api-dev.wellcomecollection.org/`
by adding the following to the `.env` file in both `./content/webapp` and `./identity/webapp`:

```
NEXT_PUBLIC_API_ENV_OVERRIDE="dev"
```

This will configure the local version of nginx to proxy requests to the local APIs, 
see [scripts/configure-local-apis](./scripts/configure-local-apis) for more information.


#### Choosing specific APIs

You can choose which APIs the content app uses locally by setting the following environment variables in the `.env` file:

```
NEXT_PUBLIC_CONTENT_API_ENV_OVERRIDE="dev"
NEXT_PUBLIC_CONCEPTS_API_ENV_OVERRIDE="stage"
NEXT_PUBLIC_CATALOGUE_API_ENV_OVERRIDE="prod"
```

API environment is specified in the following order of precedence:

1. `toggles?.stagingApi` is unset, all APIs are set to `prod`
1. `toggles?.stagingApi` is true, then all APIs are set to `stage`
1. `NEXT_PUBLIC_API_ENV_OVERRIDE` is set, then all APIs are set to the value of `NEXT_PUBLIC_API_ENV_OVERRIDE`
1. `NEXT_PUBLIC_CONTENT_API_ENV_OVERRIDE`, `NEXT_PUBLIC_CONCEPTS_API_ENV_OVERRIDE`, or `NEXT_PUBLIC_CATALOGUE_API_ENV_OVERRIDE` are set, then the respective API is set to the value of the environment variable.

#### Using www-dev.wellcomecollection.org

Adding the local API confguration allows you to use the `www-dev.wellcomecollection.org` domain to access the website on your local machine.

This allows content and identity to behave correctly when running locally, as paths between the two apps are relative to the domain.

**Note:** [Fast refresh](https://nextjs.org/docs/architecture/fast-refresh) is not available when using the `www-dev.wellcomecollection.org` domain.

### Running content & identity together

You can run both apps together with the following command:

```bash
(yarn content & yarn identity)
```

**Note:** both apps should have the same `NEXT_PUBLIC_API_ENV_OVERRIDE` value in their `.env` files.

### Running CI steps locally

In order to reproduce a build step locally you can run the same `docker compose` command that [Buildkite](https://buildkite.com/wellcomecollection/experience) runs.

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

You can then run `docker compose` commands as would occur in the CI environment.

```shell script
docker compose edge_lambdas build
docker compose edge_lambdas run
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
