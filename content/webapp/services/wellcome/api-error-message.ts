import { WellcomeApiError } from '@weco/content/services/wellcome';

/**
 * The heading for the error page after a failed API call. A 4xx means the
 * request was the problem, and the API's description tells the visitor what to
 * change (e.g. "Only the first 10000 works are available…"), so it's shown as
 * it was before. For anything else the API failed, so its text is for us: the
 * visitor gets `fallback`, and the details are in the server logs.
 */
export const apiErrorMessage = (
  error: WellcomeApiError,
  fallback: string
): string =>
  error.httpStatus >= 400 && error.httpStatus < 500 && error.description
    ? error.description
    : fallback;
