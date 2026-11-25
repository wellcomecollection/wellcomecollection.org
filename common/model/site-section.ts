const siteSectionList = [
  'visit-us',
  'whats-on',
  'stories',
  'collections',
  'get-involved',
  'about-us',
  'exhibition-guides',
] as const;
export type SiteSection = (typeof siteSectionList)[number];

export const isSiteSection = (section: unknown): section is SiteSection => {
  return (
    typeof section === 'string' &&
    (siteSectionList as readonly string[]).includes(section)
  );
};

/** Every site section has a landing page (rendered with its own layout and
 * Header), except the exhibition guides, whose landing page
 * (`/guides/exhibitions`) uses the basic header.
 */
export const isLandingPageSection = (
  section: unknown
): section is SiteSection =>
  isSiteSection(section) && section !== 'exhibition-guides';
