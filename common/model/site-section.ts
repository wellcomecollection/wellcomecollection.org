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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isSiteSection = (section: any): section is SiteSection => {
  return siteSectionList.includes(section);
};
