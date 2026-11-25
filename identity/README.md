# Identity

This is the application for users to manage their accounts.

It handles authentication and session via https://github.com/auth0/nextjs-auth0, and other apps on wellcomecollection.org can request the user's identity from the session by asking for `/account/api/auth/me`.

## Local development

Unlike the `catalogue` and `content` apps, which talk to unauthenticated APIs, the `identity` app needs some credentials to talk to Auth0 and the identity API.

There's a local dev client set up in the [identity repo](https://github.com/wellcomecollection/identity), whose credentials are in Secrets Manager.

If you run:

```console
$ yarn start:dev
```

then the app will start using credentials fetched from Secrets Manager.

That runs it against the stage Auth0 tenant and v1 identity API. To run it against another tenant, such as the dev tenant, set the values in `.env` (see `.env.example`). Set `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `IDENTITY_API_HOST` and `IDENTITY_API_KEY` together, since any left empty fall back to stage's.

To use the v2 identity API for patrons linked to FOLIO, also set `IDENTITY_API_V2_HOST` and `IDENTITY_API_V2_KEY`, and turn on the `identityApiV2` toggle. The dev tenant has no working v1 API, so there only requests that go to v2 succeed.

In order to test the app with Docker locally, you will need to make aws credentials available by adding the following to the `identity` block in the [docker-compose.yml](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/docker-compose.yml#L15-L21), at the same level as the `image` and `build` keys:

```
volumes:
  - ~/.aws:/root/.aws
```

(this assumes you have aws credentials stored in `~/.aws`)

Then run:

```console
$ docker compose build --build-arg INSTALL_AWSCLI=true identity
$ docker compose run --user root -p 3003:3003 identity yarn start:dev
```

The image runs as a non-root user, but `yarn start:dev` needs root to write Next.js dev files and to read the mounted `/root/.aws`.
