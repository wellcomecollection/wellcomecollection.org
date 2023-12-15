# data

This folder contains the hard-coded data and text for the site; stuff which can't be configured in Prismic or the catalogues.
We keep it in one place so it's easy to find and review.

These files should ideally be kept simple, so that non-devs can understand them and suggest changes.

Files likely to be especially interesting to non-devs:

* [`hardcoded-ids.ts`](./hardcoded-ids.ts) – a list of Prismic IDs, including the ID of the series featured on the /stories page
* [`microcopy.tsx`](./microcopy.tsx) – all the short bits of text that appear on the site, including page descriptions and some titles
* [`organization.ts`](./organization.ts) – the organisation contact info, including phone number and address
