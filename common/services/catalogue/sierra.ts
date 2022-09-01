// Returns true if a query parameter is plausibly a Sierra ID, false otherwise.
//
// There's no way for the front-end to know what strings are valid Sierra IDs
// (only Sierra itself knows that), but it can reject certain classes of
// strings that it knows definitely aren't.
//
// e.g. an empty string definitely isn't a Sierra ID.
//
// A Sierra ID is a string starting with 'b', seven digits, then an eighth
// check digit which may be an 'x'.

import { isString } from '@weco/common/utils/array';

export const looksLikeSierraId = (
  id: string | string[] | undefined
): id is string => (isString(id) ? /^(b[0-9]{7}[0-9x])$/.test(id) : false);
