# Identity

This is the application for users to manage their accounts.

It handles authentication and session via https://github.com/auth0/nextjs-auth0, and other apps on wellcomecollection.org can request the user's identity from the session by asking for `/account/auth/profile`.

## Local development

Unlike the `catalogue` and `content` apps, which talk to unauthenticated APIs, the `identity` app needs some credentials to talk to Auth0 and the identity API.

There's a local dev client set up in the [identity repo](https://github.com/wellcomecollection/identity), whose credentials are in Secrets Manager.

If you run:

```console
$ yarn start:dev
```

then the app will start using credentials fetched from Secrets Manager.

In order to test the app with Docker locally, you will need to make aws credentials available by adding the following to the `identity` block in the [docker-compose.yml](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/docker-compose.yml#L15-L21), at the same level as the `image` and `build` keys:

```
volumes:
  - ~/.aws:/root/.aws
```

(this assumes you have aws credentials stored in `~/.aws`)

Then run:

```console
$ docker compose build identity
$ docker compose run -p 3003:3003 identity yarn start:dev
```
