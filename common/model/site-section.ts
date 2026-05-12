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
