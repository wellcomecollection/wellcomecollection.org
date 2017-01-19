# wellcomecollection.org server

This project works best if you have compiled the [static](../static) project into the
`../dist` folder as we reference those files in the HTML.


## Dev

```bash
npm install
npm run dev
```


## Prod (uses PM2)

```bash
npm install
npm run start
```

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


## Cross browser testing

```bash
npm run test:browsers <url>
```

The test opens your browser at browserstack.com with screenshots of the url in browsers we test on.
You can also click through to instances of those browsers.

In order for this to work need to add your browserstack credentials to 'browserstack/browserstack-config.json'
in the follwing format:

{
  "username": "<browserstack_username>",
  "key": "browserstack_key"
}

**N.B. This file is git ignored, but worth mentioning that it should not be committed**
