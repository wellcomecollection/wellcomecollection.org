# wellcomecollection.org

The new home of the betanextbest.wellcomecollection.org website.

## client

```bash
cd client
npm install
npm run compile:watch # for local development
# or
npm compile # one-off compile, used on build
```

## server

```bash
cd server
npm install
npm run watch
```

## infra

```bash
cd infra
npm install
```

The assets are then compiled to the root `/dist` directory which is then referenced by the server
app via koa-static.
