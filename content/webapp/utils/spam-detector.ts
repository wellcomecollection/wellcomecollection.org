/** This implements some basic spam-detection heuristics.
 *
 * We see a lot of spam on the search page -- people stuffing in nonsense queries,
 * or links to spam sites (casinos, scams, porn, etc).  We want to reject these as
 * quickly as possible; to avoid them gumming up our analytics and putting unnecessary
 * load on our back-end search systems.
 *
 * The heuristics were chosen with the following principles/assumptions:
 *
 *    - We're trying to cut the spam, not stop it entirely.
 *
 *      It's enough to have some simple heuristics that stop the worst of the traffic.
 *      We assume we're dealing with automated spam bots, not dealing with somebody
 *      who's targeting us specifically.  (If we are, we should start by making these
 *      rules private!)
 *
 *    - We should never impact legitimate users.  It's better to serve a request to
 *      a spam bot than break the site for a real person.
 *
 *    - These checks should be fast; we don't want to slow down the site for real users
 *      with overly expensive spam checks.
 *
 * == How these heuristics were developed ==
 *
 * I downloaded the CloudFront logs for a 2-week-long period, and looked at any request
 * that had a `query` parameter (which is where a lot of the spam comes in).
 *
 * Then I wrote a script that would try a candidate heuristic over these requests,
 * and report:
 *
 *    - the total number of requests that were accepted/rejected
 *    - the average time taken to process each request
 *    - a random sample of accepted/rejected requests
 *
 * I ran this multiple times to refine the heuristic, until a good number of the sample
 * of accepted requests looked like bona-fide traffic.
 *
 * Note: the original implementation of this heuristic ran in CloudFront, where we have
 * access to the User-Agent header, and could detect self-identified bot traffic
 * (a lot of spammers would impersonate Googlebot/Bingbot).  We would then apply
 * stricter heuristics for those self-identified bots.  When we moved this into the
 * Next.js app, we lost easy access to that header, and we switched everything to the
 * more permissive heuristic used for people.
 *
 * It would be possible to pass the User-Agent header (or some approximation of it)
 * if we think it's necessary, but we'd need to be careful about how that affects our
 * caching.  For now we haven't done that, but it remains an option.
 *
 */

import { isString, isUndefined } from '@weco/common/utils/type-guards';

const isUnusualCharacter = (c: string): boolean => {
  const code = c.charCodeAt(0);

  return (
    // This is a couple of accented characters which aren't especially suspicious
    // on their own, but they appear a lot in queries for Chinese characters that
    // are improperly encoded.
    //
    // e.g. "我们" gets encoded as "æä»¬"
    //
    // The choices here are loosely based on
    // https://utf8-chartable.de/unicode-utf8-table.pl?start=28480&names=-&utf8=string-literal
    // https://utf8-chartable.de/unicode-utf8-table.pl?start=38144&utf8=0x
    //
    code === 0xc2 ||
    code === 0xc3 ||
    (code >= 0xe4 && code <= 0xe9) ||
    code === 0x80 ||
    code === 0xb3 ||
    code === 0xb6 ||
    code === 0xbd ||
    code === 0xbe ||
    code === 0xbf ||
    (code >= 0x94 && code <= 0x97) ||
    // This is based on the ranges for Han (Chinese) ideographs; see
    // this answer on Stack Overflow: https://stackoverflow.com/a/1366113/1558022
    //
    // We're not being super precise here because anything high-Unicode is probably
    // a bit suspicious here.
    (code >= 0x4e00 && code <= 0xfaff) ||
    //
    // This covers Hiragana (Japanese) characters; see the table describing
    // the Unicode block on Wikipedia: https://en.wikipedia.org/wiki/Hiragana_(Unicode_block)
    (code >= 0x3041 && code <= 0x309f) ||
    //
    // These are the two parts of ㊙️, which is sometimes sent as a combination
    // of two characters:
    //
    //    U+3299 Circled Ideograph Secret
    //    U+FE0F Variation Selector-16 (which triggers Unicode)
    //
    code === 0x3299 ||
    code === 0xfe0f
  );
};

export const looksLikeSpam = (
  queryValue: string | string[] | undefined
): boolean => {
  console.log(queryValue);

  if (isUndefined(queryValue)) {
    return false;
  }

  const query = isString(queryValue) ? queryValue : queryValue.join(' ');

  // Reject any queries which are incredibly long.
  //
  // The load balancers in front of the API have a limit of 2048 characters in a URI;
  // any more than that, and they return an HTTP 414 URI Too Long error.  We use some
  // characters for the API hostname, path, etc.; this limit should reject anything
  // ridiculously long before it goes to the API.
  //
  // As a bonus, if any legitimate user types in a super-long query, they'll be prompted
  // to adjust their query rather than shown a generic error page.
  if (query.length > 2000) {
    return true;
  }

  // Count unusual characters in the query string.
  //
  // A lot of our spam queries feature a long string of Chinese, with links to
  // sketchy-looking sites mixed in the middle.  This is a clue!
  //
  // But we can't reject all queries with Chinese characters, because we have
  // some Chinese in the catalogue that real people might be searching for.
  // It's rare and isn't on many works, but it does occur in a few records
  // e.g. https://wellcomecollection.org/works/grgcnqwf
  //
  // So we implement this check as follows:
  //
  //    - Pick a threshold for most unusual characters allowed in a query.
  //    - Count the number of unusual characters in the query.
  //    - If it's higher than the threshold, mark the request as spam.
  //
  // The threshold is significantly lower for users that self-identify as bots
  // in their User-Agent header.
  //
  // Implementation note: this check is somewhat expensive, so we skip running it
  // if the query is too short to exceed the threshold.
  const maxUnusualCharsAllowed = 25;

  if (query.length >= maxUnusualCharsAllowed) {
    let unusualCharacterCount = 0;

    const tooManyUnusualCharacters = query.split('').some(char => {
      if (isUnusualCharacter(char)) {
        unusualCharacterCount += 1;
      }

      return unusualCharacterCount >= maxUnusualCharsAllowed;
    });

    if (tooManyUnusualCharacters) {
      return true;
    }
  }

  return false;
};
