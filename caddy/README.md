# Caddy for local dev

This project is a WIP.

This project is intended to allow developers to run multiple Next.js apps locally over HTTPS.

## Setup

install [Caddy](https://caddyserver.com/docs/install)

## Go!

from the workspace root `wellcomecollection.org/`, ensure that you have the three apps running with the following ports

```bash
PORT=3001 yarn workspace @weco/catalogue run start
PORT=3002 yarn workspace @weco/identity run start
PORT=3003 yarn workspace @weco/content run start
```

then in another terminal navigate to the caddy folder

```
cd caddy
caddy run
```

navigate to [localhost!](http://localhost:3000/)

## TODO

- [ ] add all page routes so that the proxy redirects all the correct `/_next/**`
- [ ] potentially automate the process of building the `Caddyfile`
