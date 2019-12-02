# Wellcome Collection

Wellcome Collection web applications.

[![Join the chat at https://gitter.im/wellcometrust/wellcomecollection.org](https://badges.gitter.im/wellcometrust/wellcomecollection.org.svg)](https://gitter.im/wellcometrust/wellcomecollection.org?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![CircleCI](https://circleci.com/gh/wellcometrust/wellcomecollection.org/tree/master.svg?style=shield)](https://circleci.com/gh/wellcometrust/wellcomecollection.org/tree/master)

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

We then use [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) to manage our [local, common dependencies](https://github.com/wellcometrust/wellcomecollection.org/tree/master/common).

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

To deploy either the `content` or `catalogue` services, once a pull request is merged and `master` has successfully built in CI then run:
```
yarn deployCatalogue
```
or, respectively,
```
yarn deployContent
```
in the root directory of this repo. These will confirm what will be deployed and then attempt to `terraform apply` with the latest images: *you may need to run `terraform init` in the `<service>/terraform` directories before this will work*. You will also need to have valid AWS creds active in your current shell session.

## Other pieces of the Wellcome Collection puzzle

[Wellcome Collection Digital Platform](https://github.com/wellcometrust/platform).

[Stacks](https://stacks.wellcomecollection.org/), Wellcome Collection's musings on digital developments.

[Catalogue API documentation](https://developers.wellcomecollection.org).
