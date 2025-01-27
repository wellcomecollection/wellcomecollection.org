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
  'exhibition-texts',
  'exhibition-highlight-tours',
  'stories-landing',
  'visual-stories',
  'webcomic-series',
] as const;

const contentApiContentTypes = [
  'Book',
  'Event series',
  'Event',
  'Exhibition',
  'Visual story',
  'Exhibition text',
  'Page',
  'Exhibition highlight tour',
  'Project',
  'Article',
  'Season',
];

export type ContentType = (typeof contentTypes)[number];
export type ContentApiContentType = (typeof contentApiContentTypes)[number];
/* eslint-disable @typescript-eslint/no-explicit-any */
export function isContentType(type: any): type is ContentType {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return typeof type && contentTypes.includes(type);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function isContentApiContentType(
  type: any
): type is ContentApiContentType {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return typeof type && contentApiContentTypes.includes(type);
}
