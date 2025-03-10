// Returns true if a query parameter is plausibly a Prismic UID, false otherwise.
// It could also be used to check for valid Prismic IDs, even though we don't use those as heavily anymore.
//
// Any low-ascii characte based string will be considered a valid Prismic UID,
// but this still helps reject certain classes of strings that it knows definitely aren't.
// e.g. an empty string definitely isn't a Prismic ID.
//
// This is useful for rejecting queries that are obviously malformed, which might
// be attempts to inject malicious data into Prismic queries.

import { isString } from '@weco/common/utils/type-guards';

// \w: Matches any word character (alphanumeric & underscore).
//     Only matches low-ascii characters (no accented or non-roman characters).
//     Equivalent to [A-Za-z0-9_].
// Added "-" to be matched as well.
// + means empty strings will return false.
export const looksLikePrismicId = (
  id: string | string[] | undefined
): id is string => (isString(id) ? /^[\w-]+$/.test(id) : false);
