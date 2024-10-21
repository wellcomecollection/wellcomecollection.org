// TODO modify logic for this. Should we make UID the canonical link?
/** Is this URL a vanity URL?
 *
 * e.g. /visit-us instead of /pages/X8ZTSBIAACQAiDzY
 *
 * It's moderately fiddly to get all the defined vanity URLs out of the
 * app controller, so we use a heuristic instead.
 */
export function isVanityUrl(pageId: string, url: string): boolean {
  // Does this URL contain a page ID?  We look for the page ID rather
  // than a specific prefix, because this template is used for multiple
  // types of Prismic content.
  //
  // e.g. /pages/X8ZTSBIAACQAiDzY, /projects/X_SRxhEAACQAPbwS
  const containsPageId = url.includes(pageId);

  // This should match a single alphanumeric slug directly after the /
  //
  // e.g. /visit-us, /collections
  const looksLikeVanityUrl = url.match(/\/[a-z-]+/) !== null;

  return !containsPageId && looksLikeVanityUrl;
}
