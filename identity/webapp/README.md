# Account management
The chosen Node library for this API is the [Koa framework](https://koajs.com/). It is a battle-tested Node framework
with a similar api to Express. The code base is written in Typescript and runs using [pm2](https://pm2.keymetrics.io/)
process manager and built into a Docker image.

## 3rd Party components
This repository uses a set of components, many of which are part of a standard set used by a few other projects at
Digirati for Node-based micro-services. This is a breakdown of each of the libraries, where they are used and why.

#### Node runtime
- [AJV](https://github.com/ajv-validator/ajv) - JSON Schema validator, used for validating request bodies
- [koa](https://koajs.com/) - The http framework that handles requests
    - [@koa/router](https://github.com/ZijianHe/koa-router) - Path-to-regexp based router with express-like API
    - [koa-body](https://www.npmjs.com/package/koa-body) - Parses content types into Javascript objects
    - [koa-json](https://www.npmjs.com/package/koa-json) - Serves and serialises JSON responses
    - [koa-logger](https://www.npmjs.com/package/koa-logger) - Logs request and response endpoints and status codes (can be disabled in production)
    - [koa-send](https://www.npmjs.com/package/koa-send) - Serves static files
    - [koa-session](https://www.npmjs.com/package/koa-session) - Simple and secure cookie based session store
- [passport](http://www.passportjs.org/) - Handles authentication strategies, including Auth0
    - [passport-local](https://www.npmjs.com/package/passport-local) - Development authentication
    - [passport-auth0](https://www.npmjs.com/package/passport-auth0) - Auth0 strategy for authentication
    - [koa-passport](https://www.npmjs.com/package/koa-passport) - Koa middleware for passport (wraps express middleware)
- [PM2](https://pm2.keymetrics.io/) - NodeJS process manager

### Frontend runtime
The frontend has not yet been fleshed out, but the following have been installed in preparation for development:

- [React v16.14 + React DOM v16.9](http://reactjs.org/) - For rendering the client side HTML
- [Styled components](https://styled-components.com/) - For styling components

### Build tools
This is not exhaustive. The full list can be found in the `package.json`.

- [Typescript compiler](https://www.typescriptlang.org/) - Compiles Typescript to javascript
- [Webpack](https://webpack.js.org/) - Produces the Frontend bundles
- [Babel](https://babeljs.io/) - Used in webpack to transpile javascript to target specific browsers
- [Typescript to JSON Schema](https://github.com/YousefED/typescript-json-schema) - Converts Typescript interfaces into JSON schemas for validating request bodies

The build process is roughly as follows:

- Convert all typescript interfaces inside `./src/types/schemas` into JSON Schemas and save to `./schemas`
- Use the typescript compiler to convert all Typescript into Javascript in `./lib` folder
- Bundle the contents of `./src/frontend` into a bundle to target the web and place it in `./lib/frontend/build/`

Although not common, the hybrid frontend/backend allows has a few benefits.

- Utility functions and types can be used by both the frontend and backend as required, so long as node internals are not used.
- Keeps the door open for the backend to server render some HTML if required (e.g. Login pages) without loading FE bundle.

## Development

The following tools are used in development.

- [Docker compose](https://docs.docker.com/compose/) - An easy to spin up environment for development
- [ESLint](https://eslint.org/) - Lints and catches errors and bugs during development
- [Prettier](https://prettier.io/) - Code style

Prettier is run through eslint. Enabling eslint in your IDE should pick up the configuration automatically after
running `yarn install && yarn build` for the first time.

To get started with an environment:
```
$ docker-compose up
```
A server will be created on port 3000.

If you want to change the node code, then you can watch it with
```
$ yarn build:ts --watch
```

If you want to change the frontend code, then you can watch it with
```
$ yarn build:frontend --watch
```

If you change a type in the schema folder, you can recreate the JSON schema using:
```
$ yarn build:frontend
```

If you add a new module to the `package.json` with the docker-compose running, it will not pick up the change until
you restart with `docker-compose up --build` or alternatively you can run:
```
docker-compose exec service yarn install
```

### Configuring Auth0 integration
You can create a `.env` file to test Auth0 integration:
```
# Set to local for testing.
AUTH_METHOD=auth0

AUTH0_CLIENT_ID=[...]
AUTH0_DOMAIN=[...].auth0.com
AUTH0_CLIENT_SECRET=[...]
AUTH0_CALLBACK_URL=http://localhost:3000/callback

```

You need to set up an Auth0 application and set the login, callback to allow localhost:3000. By default, there is a
shim that uses a static login/password (test:test).

There is more configuration for session management in `src/config.ts` and should all be typed if we need to expand.

These are the same environment variables expected in a production environment. In a production environment the `AUTH0_*` environment variables must be set or else the application will not start.

### Session keys

In addition to the Auth0 environment variables, there is a `KOA_SESSION_KEYS` environment variable that should be a
comma-separated list of random strings. These are used to sign cookies. The application will not run if you do not
have at least one session key.

## Custom boilerplate
To facilitate rapid development, a few custom components have been created.

- TypedRouter (`./src/utility/typed-router.ts`) - This is a wrapper around the koa router to add TypeScript types. (see routing below)
- Error handler (`./src/middleware/error-handler.ts`) - This is a global error handler for catching Errors and providing codes and responses.
- Request body (`./src/middleware/request-body.ts`) - This adds strongly typed AND JSON schema validated request bodies to POST/PUT requests
- Asset route (`./src/routes/assets/frontend-bundle.ts`) - Serves up webpack bundles and chunks.
- Schema generator (`./generate-schemas.js`) - Script to read types and generate JSON schemas for validating bodies.
- Application types (`./src/types/application.ts`) - Types for the global context in Koa

## Creating new routes
Before thinking about the URL structure of an endpoint, it's useful to think about the data you need. The code that
serves the routes is found in `./src/routes`.

Here is a basic route:

```ts
import { RouteMiddleware } from './application';

export const ping: RouteMiddleware = (context) => {
  context.response.body = { ping: 'pong' };
};
```

The type assigned to the function is `RouteMiddleware`. This is a custom type that adds types for the application
state and context. This extends the Koa Middleware type. The `RouteMiddleware` is generic and accepts two arguments.

The first is the parameters from the url. If you had a `user_id` in the url you can type this in the middleware:
```ts
import { RouteMiddleware } from './application';

export const getUser: RouteMiddleware<{ user_id: string }> = (context) => {
  context.params.user_id; // correctly typed.
  // ...
};
```

The second is the type of the POST body.
```ts
import { RouteMiddleware } from './application';

type UserModel = {};

export const updateUser: RouteMiddleware<{ user_id: string }, UserModel> = (context) => {
  context.requestBody; // Correctly typed to UserModel
};
```
If you would like runtime validation of this body type, then you can add it to `./types/schemas/` folder and it
will create a JSON schema.

You can let the router know it should validate against that type using the JSON Schema (`./src/router.ts`)

```ts
export const router = new TypedRouter({
  'update-user': [TypedRouter.PUT, '/api/users/:user_id', updateUser, 'UserModel'], // <-- UserModel matches the type name
});
```

This should match the generated file in `./schemas/UserModel.json` and also the type name. This is optional.

In your route you can also protect an endpoint by checking the context for the authorised user.
```ts
import { RouteMiddleware } from './application';

export const ping: RouteMiddleware = (context) => {
  if (!context.isAuthenticated()) {
    throw new Error();
  }

  context.response.body = { ping: 'pong' };
};
```
These errors can be created and caught in the error handler. This helper is provided by the passport integration.

### Making API requests

With the Auth0 integration, there is a `context.state.user` variable set that contains data about the current user session.
This includes a token that can be used to make authenticated calls to other APIs.

If you are making requests, I would recommend using `node-fetch` to keep the APIs used in the browser and in Node the
same.

```ts
const response = await fetch(
  `http:// ... /api/endpoint`,
  {
    method: 'PUT',
    body: JSON.stringify({ ... }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${context.state.user.accessToken}`
    },
  }
);

if (!response.ok) {
  // ... error handling
}

const json = await response.json();

// ...
```

All the routes from the API defined in this repository are stubbed out with a proposed URL structure. There is also
an example using the schemas from the top level `./models` in the identity repository. If these get updated
there is a script (`node ./tools/generate-ts.js`) that will recreate the typescript types for these schemas. These
will get re-converted back into Schemas mapped to the Typescript types again as part of the build.

### Changing Auth0 configuration
At the moment all the data we get from Auth0 is stored in the session to be used. We might not need all of this
information. The mapping of this data from Auth0 to session is found in `./utility/configure-auth0.ts`. If we wanted
to store the information somewhere else we can do that here too.

The following routes are configured for Auth0 in the router:

- Login (`/login`) - this will redirect the user to Auth0 to authenticate
- Logout (`/logout`) - this will remove the current session, but not remove the Auth0 session
- Callback (`/callback`) - this will accept the token from Auth0's callback

All of this is handled by Passport.js and their Auth0 provider.

## Frontend code
All the frontend code should live inside `./src/frontend`. At the moment it is just a plain file rendering some JSX.

A simple router can be added. Any route that does not match an API will render the React frontend, so we do not need
to use a hash router for this.

The route that renders the HTML for before the React component can be found at `./routes/index.ts`. This is a very
minimal HTML document with a link to the webpack bundle. This is intended to be a starting point.
