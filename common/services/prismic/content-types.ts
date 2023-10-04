// These are the types we make addressable from Prismic
const contentTypes = [
  'articles',
  'books',
  'event-series',
  'events',
  'exhibitions',
  'guides',
  'pages',
  'projects',
  'seasons',
  'series',
  'webcomics',
  'guide-formats',
  'exhibition-guides',
  'stories-landing',
  'visual-stories',
] as const;

export type ContentType = (typeof contentTypes)[number];
/* eslint-disable @typescript-eslint/no-explicit-any */
export function isContentType(type: any): type is ContentType {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return typeof type && contentTypes.includes(type);
}
