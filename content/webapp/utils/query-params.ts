import { ParsedUrlQuery } from 'querystring';

import { isString, isUndefined } from '@weco/common/utils/type-guards';

/** Extracts the page from the query parameter.
 *
 * We prefer this to extracting the 'page' directly from the query parameter
 * because query parameters are of type `string | string[] | undefined`, whereas
 * downstream APIs tend to want a `number` for page values.
 *
 * If this function returns an Error, it should be returned to the user as a
 * 400 Bad Request with the supplied message.
 *
 */
export function getPage(q: ParsedUrlQuery): number | Error {
  const { page } = q;

  // If the user doesn't supply a page parameter, return 1
  if (isUndefined(page)) {
    return 1;
  }

  // If the user supplies multiple page parameters, we can't do anything
  // sensible.
  if (!isString(page)) {
    return {
      name: 'Bad Request',
      message: 'Only supply a single "page" in the query parameter',
    };
  }

  // If the user supplies something that isn't an int, we can't do anything sensible.
  const parsedPage = parseInt(page, 10);
  if (isNaN(parsedPage)) {
    return {
      name: 'Bad Request',

      // The use of JSON.stringify() here is to wrap the value in quotes, so it's
      // clear what's part of the error message and what's the user-supplied value.
      message: `${JSON.stringify(page)} is not a number`,
    };
  }

  return parsedPage;
}
