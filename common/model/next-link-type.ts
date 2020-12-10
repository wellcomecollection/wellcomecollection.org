import { UrlObject } from 'url';
import { ParsedUrlQueryInput } from 'querystring';

// We've used `Type` prefix as we use the
//   `import NextLink from 'next/link'`
// naming convention

export type NextLinkType = {
  href: Omit<UrlObject, 'query'> & {
    query?: null | ParsedUrlQueryInput;
  };
  as: Omit<UrlObject, 'query'> & {
    query?: null | ParsedUrlQueryInput;
  };
};
