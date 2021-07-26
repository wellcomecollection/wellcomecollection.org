# Lighthouse CI server

This is a Lighthouse CI server as documented [here](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/server.md). It has the following changes/additions over the default:

- Configuration via environment variables
  - `DB_HOST`, `DB_NAME`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` for connecting to a mysql database
  - `PORT` for the application port
  - `ADMIN_USER` and `ADMIN_PASSWORD` for basic auth protection (see next point)
- Basic auth protection for new project creation: the default server [supports](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/server.md#basic-authentication) HTTP Basic Auth by default, but applies it to _all_ endpoints. This application only protects `POST /v1/projects` (the new project creation endpoint), as all other admin-type routes are protected by the build token or the admin token. This endpoint should never be used in practice, but if it is (via the command line tool), the `basicAuth.username` and `basicAuth.password` options in the CLI will work with it.
