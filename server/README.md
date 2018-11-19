# wellcomecollection.org server

The package that other webapps rely on to serve a common [KoaJS](http://koajs.com/) server,
and some common services, utils and tid-bits. We should be trimming this and splitting it up over time.

## Requirements
* [Node 8](https://nodejs.org/en/)
* [Yarn `brew install yarn`](https://yarnpkg.com/lang/en/docs/install/)

## Dev
```
# ensure you've yarn installed at the root directory, this is where we keep our devDependecies
yarn install
yarn run app:dev
```

This will run app with [`babel-node`](http://babeljs.io/docs/usage/cli/#babel-node), restarting the server
on file change to have your changes take effect.


## Build
```
yarn install
yarn run app:build
```

This will create a [`webpack`](https://webpack.js.org/) generated package of the app in the `.dist` folder.
Along with the JS file, we ship the [`./views`](./views) there too.


## Accessibility testing
```bash
npm run test:accessibility <url>
```

The test outputs 3 message types:

- **error** clear-cut guideline violations that must be fixed
- **warnings** items it identifies that require human verification to determine if guidelines are breached
- **notices** items the system can't detect that require human verification to determine if guidelines are breached

It is important to resolve/verify all 3 types in order to achieve standards compliance.
Additional guidance on manually checking warnings and can be found here:
https://github.com/wellcometrust/developer-docs/blob/master/front-end/accessibility/Webpage_Accessibility_Audit_Procedure.md
