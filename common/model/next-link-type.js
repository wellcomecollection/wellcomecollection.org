// @flow
import type { Url } from './url';
// We've used Type here as we have the NextLink naming convention for importing
// the module `next/link`
export type NextLinkType = {|
  href: Url,
  as: Url,
|};
