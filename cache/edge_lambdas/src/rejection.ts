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
 */

import {
  CloudFrontRequest,
  CloudFrontRequestEvent,
  CloudFrontResponse,
} from 'aws-lambda';

// Returns true if this request looks like a bot.
//
// A lot of spam requests will spoof their User-Agent header to look like a popular
// web crawler, e.g. Googlebot or Bingbot.  Because a person would never spoof their
// User-Agent this way, we can use this as an excuse to apply more stringent checks.
const isBotRequest = (request: CloudFrontRequest): boolean => {
  const userAgent = request.headers['user-agent']?.[0]?.value || '';

  return (
    userAgent.toLowerCase().includes('bot') ||
    userAgent.toLowerCase().includes('search.yahoo')
  );
};

const isUnusualCharacter = (c: string): boolean => {
  const code = c.charCodeAt(0);

  return (
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

export const looksLikeSpam = (event: CloudFrontRequestEvent): boolean => {
  const cf = event.Records[0].cf;
  const request = cf.request;

  const requestParams = new URLSearchParams(request.querystring);
  const query = requestParams.getAll('query').join(' ');

  // Look for the `query` URL parameter.
  //
  // The majority of our spam comes from people plugging in values to the
  // search form and stuffing bogus values into the query parameter.
  // If there isn't a query parameter on this request, it's probably not spam.
  if (query === '') {
    return false;
  }

  // Look for spammy keywords and emoji.
  //
  // We can't solely rely on the presence of these words/characters to indicate spam,
  // but they're a clue -- usually accompanied by long strings of Chinese characters
  // and a URL to a sketchy-looking site.
  //
  // To avoid penalising real users, we only treat this text as spam if the user
  // has self-identified as a bot/crawler in their User-Agent header.
  //
  // In my analysis, this flagged ~41% of all search traffic.
  const spamKeywords = [
    'cash',
    'casino',
    'chatgpt',
    'crypto',
    'ddos',
    'free',
    'fun',
    'game',
    'give away',
    'give-away',
    'giveaway',
    'play',
    'poker',
    'telegram',
    'whatsapp',
    'win',
    '➡️',
    '☀️',
    '⏩',
    '⛔',
    '⚽',
    '✅',
    '🐯',
    '🍀',
    '㊙',
    '✔️',
    '⭐',
    '👈',
    '👉',
  ];

  if (
    isBotRequest(request) &&
    spamKeywords.some(kw => query.toLowerCase().includes(kw))
  ) {
    return true;
  }

  // Look for query parameters that we don't use.
  //
  // I noticed that a lot of search requests include query parameters that we don't
  // define in our apps, and with values that aren't meaningful.  If one of these are
  // present, it suggests you're probably not a real person.
  //
  // In my analysis, this flagged ~4% of all search traffic.
  const unrecognisedParams = ['ID', 'news', 'action', 'cat', 'token', 'type'];

  if (unrecognisedParams.some(name => requestParams.get(name) !== null)) {
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
  //
  // In my analysis, this flagged ~70% of all search traffic.
  const maxUnusualCharsAllowed = isBotRequest(request) ? 10 : 30;

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

export const getRejection = (
  event: CloudFrontRequestEvent
): CloudFrontResponse | undefined => {
  return undefined;
};
