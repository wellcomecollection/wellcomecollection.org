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
