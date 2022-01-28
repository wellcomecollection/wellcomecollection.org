// Returns true if a query parameter is plausibly a Prismic ID, false otherwise.
//
// There's no way for the front-end to know what strings are valid Prismic IDs
// (only Prismic itself knows that), but it can reject certain classes of
// strings that it knows definitely aren't.
//
// e.g. an empty string definitely isn't a Prismic ID.
//
// This is useful for rejecting queries that are obviously malformed, which might

import { isString } from '@weco/common/utils/array';

// be attempts to inject malicious data into Prismic queries.
export const looksLikePrismicId = (
  id: string | string[] | undefined
): boolean => (isString(id) ? /^([A-Za-z0-9-_]+)$/.test(id) : false);
