# wellcomecollection.org

The new home of the betanextbest.wellcomecollection.org website.

## client

```bash
cd client
npm install
npm run compile:dev # to watch for changes and compile in local dev
# or
npm compile # one-off compile, used on build
```

## server

```bash
cd server
npm install
npm run dev
```

## infra

```bash
cd infra
npm install
```

The assets are then compiled to the root `/dist` directory which is then referenced by the server
app via koa-static.

## Editor settings

Be aware that the Sass (`.stylelintrc`) and JS (`.eslintrc.json`) lint config files – and their node module dependencies – are contained within the `client` directory. You should configure your editor to resolve the correct node modules path in order for linting to work with your editor open at the root of the project.
