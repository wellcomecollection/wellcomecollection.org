import { UrlObject } from 'url';
import { ParsedUrlQueryInput } from 'querystring';

// We've used `Type` prefix as we use the
//   `import NextLink from 'next/link'`
// naming convention

export type NextLinkType = {
  href: UrlObject & {
    query?: null | ParsedUrlQueryInput;
  };
  as: UrlObject & {
    query?: null | ParsedUrlQueryInput;
  };
};
