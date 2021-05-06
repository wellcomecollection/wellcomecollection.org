# Wellcome Collection

Wellcome Collection web applications.

[![Join the chat at https://gitter.im/wellcomecollection/wellcomecollection.org](https://badges.gitter.im/wellcomecollection/wellcomecollection.org.svg)](https://gitter.im/wellcomecollection/wellcomecollection.org?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)  [![Build status](https://badge.buildkite.com/b8986815014884f68d6d831ceaf5b8712e0e581df767a7f6bf.svg?branch=main)](https://buildkite.com/wellcomecollection/experience)

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
# yarn {appName = catalogue|content}
# e.g.
yarn catalogue
```
By default the above command will run the application at localhost:3000, you can specify a port from the application directory with the following command:
`yarn dev -p 3001`
This is useful if you want to run both the catalogue and content apps simultaneously.

## Deployment

This project uses the [weco-deploy](https://github.com/wellcomecollection/weco-deploy) tool.

### Rolling back

Display a list of releases:
`weco-deploy show-deployments --limit 30 --environment-id prod`

Choose the last one you know to be good and deploy:
`weco-deploy deploy --release-id $(LAST_GOOD_RELEASE_ID) --environment-id prod`

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

## Other pieces of the Wellcome Collection puzzle

[Wellcome Collection Digital Platform](https://github.com/wellcomecollection/platform).

[Stacks](https://stacks.wellcomecollection.org/), Wellcome Collection's musings on digital developments.

[Catalogue API documentation](https://developers.wellcomecollection.org).
