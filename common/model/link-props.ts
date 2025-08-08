import { LinkProps as NextLinkProps } from 'next/link';
import { ParsedUrlQueryInput } from 'querystring';
import { UrlObject } from 'url';

// We simplify the types of LinkProps from next/link to avoid having type checks
// throughout the code base.
export type Url = Omit<UrlObject, 'query'> & {
  query?: ParsedUrlQueryInput;
};

export type LinkProps = Omit<NextLinkProps, 'href'> & {
  href: Url;
};
