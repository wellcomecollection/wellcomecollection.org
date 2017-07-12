# wellcomecollection.org client

```bash
npm install
npm run compile:dev # to watch for changes and compile in local dev
# or
npm run compile # one-off compile, used on build
```

The assets are then compiled to the root `/dist` directory which is then referenced by the server
app via koa-static.
