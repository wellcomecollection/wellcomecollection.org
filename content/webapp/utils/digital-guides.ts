import { getCookie } from 'cookies-next';
import { GetServerSidePropsContext, PreviewData } from 'next';
import { ParsedUrlQuery } from 'querystring';

import cookies from '@weco/common/data/cookies';
import { toMaybeString } from '@weco/common/utils/routes';
import { isValidExhibitionGuideType } from '@weco/content/types/exhibition-guides';

/** When a user opens an exhibition guide on their smartphone, they can
 * choose which guide to read.  To avoid somebody having to repeatedly select
 * the same exhibition guide, we "remember" which guide they select in a cookie,
 * and redirect them the next time they open the guide.
 *
 * This logic is deliberately conservative, to avoid causing more confusion:
 *
 *    - We only redirect users who've scanned a QR code in the gallery
 *    - We only redirect users who've expressed an explicit preference for
 *      a non-default guide type (BSL or Audio Guide)
 *
 * == Historical note ==
 *
 * The original implementation of this was more aggressive: in particular,
 * it would redirect a user who landed on a guide page, even if they didn't
 * come from scanning a QR code.
 *
 * We changed it after discovering it broke the "Back" button:
 *
 *    1.  A user goes to an exhibition guide overview page `/guides/exhibitions/[id]`
 *    2.  They click to select a particular guide, say `/guides/exhibitions/[id]/audio`.
 *        This sets a preference cookie telling us the user wants audio guides.
 *    3.  They click the "Back" button in their browser because they want to see the
 *        page they were just looking at. This takes them to `/guides/exhibitions/[id]`
 *        … where we redirect them back to the guide they were just looking at.
 *
 * We only create QR codes that link to the audio guides, not the overview page, so
 * this prevents somebody getting stuck in this sort of redirect loop.
 *
 */

const legacyGuides = [
  'Y2omihEAAKLNfLar',
  'ZHXyDBQAAMCZbr6n',
  'YvJ4UhAAAPgZztMl',
  'YvUALRAAACMA2h8V',
  'Zdcs4BEAACMA6abC',
  'ZD01LBQAAC4ZiY95',
  'YzwsAREAAHylrxau',
  'ZSaiohAAACMAlJbK',
  'Y2JgxREAACcJWckj',
];

export const getCleanRedirectURL = (
  resolvedURL: string,
  userPreferenceGuideType: string
): string => {
  const splitResolvedURL = resolvedURL.split('?');
  const relativeURL = splitResolvedURL[0];
  const queryParams = new URLSearchParams(splitResolvedURL[1]);

  // Get stop number
  const urlStopNumber = queryParams.get('stopNumber');
  // The first stop's link is an exception, in that it should link to
  // the [exhibitionId]/[type] page, and not directly on the stop's page.
  const stopNumber = urlStopNumber !== '1' ? `/${urlStopNumber}` : '';
  // Delete from query params if we're redirecting to its page
  if (stopNumber) {
    queryParams.delete('stopNumber');
  }

  return `${relativeURL}/${userPreferenceGuideType + stopNumber}?${queryParams.toString()}`;
};

export const getGuidesRedirections = (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  const { req, res, resolvedUrl } = context;
  const { id: guideId, stopNumber, stopId, type, usingQRCode } = context.query;
  const hasEgWorkCookie = getCookie('toggle_egWork', { req, res }) === 'true';

  if (!usingQRCode) return;

  const userPreferenceGuideType = getCookie(cookies.exhibitionGuideType, {
    req,
    res,
  });

  const hasValidUserPreference =
    typeof userPreferenceGuideType === 'string' &&
    userPreferenceGuideType !== type &&
    isValidExhibitionGuideType(userPreferenceGuideType);

  // Supporting Jason exhibition
  // TODO remove when it closes/we adapt the QR codes
  // https://github.com/wellcomecollection/wellcomecollection.org/issues/11131
  if (
    legacyGuides.includes(toMaybeString(guideId) || '') &&
    hasValidUserPreference &&
    type &&
    typeof stopId === 'string'
  ) {
    return {
      redirect: {
        permanent: false,
        // We do a simple replace on the URL so we preserve all other URL information
        // (e.g. UTM tracking parameters).
        destination: context.resolvedUrl.replace(
          `/${type}`,
          `/${userPreferenceGuideType}`
        ),
      },
    };
  }

  // New exhibition QR codes URLs should _always_ have the following format:
  // guides/exhibitions/[exhibitionId]?stopNumber=[stopNumber]
  const hasValidStopNumber =
    typeof stopNumber === 'string' && !!Number(stopNumber);

  // TODO remove hasEgWorkCookie check once toggle is removed
  if (hasEgWorkCookie && hasValidUserPreference && hasValidStopNumber) {
    return {
      redirect: {
        permanent: false,
        destination: getCleanRedirectURL(resolvedUrl, userPreferenceGuideType),
      },
    };
  }
};
