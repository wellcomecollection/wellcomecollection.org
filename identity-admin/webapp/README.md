# Identity Admin

The Identity Admin application is a [Next.js](https://nextjs.org/) application for administrators to manage users' accounts.
It uses [@auth0/nextjs-auth0](https://github.com/auth0/nextjs-auth0) to manage authentication with Auth0, and integrates with the same remote API as [the Identity Application](../../identity/webapp).


## Getting Started

To get up and running, first install all the required dependencies:

```
yarn install
```

To build:

```
yarn build
```

And to start the application:

```
yarn start
```


## Environment Variables

There are several environment variables that must be provided at runtime in order to integrate the identity admin app with Auth0 and the identity API:

- **API_BASE_URL:** The base URL of the Identity API
- **API_KEY:** The secret access key for the Identity API
- **AUTH0_SECRET:** A long secret value used to encrypt the session cookie
- **AUTH0_BASE_URL:** The base URL of this application to be used to build the redirect back from Auth0
- **AUTH0_ISSUER_BASE_URL:** The URL of the Auth0 instance to authenticate with
- **AUTH0_CLIENT_ID:** The ID of the Auth0 client application
- **AUTH0_CLIENT_SECRET** The secret for the Auth0 client application

The easiest way to provide these for development is by creating a `.env` file in this folder with all the required environment variables (see [.env.dist](./.env.dist) for a template).
