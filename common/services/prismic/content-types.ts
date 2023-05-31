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
] as const;

export type ContentType = (typeof contentTypes)[number];

export function isContentType(type: any): type is ContentType {
  return typeof type && contentTypes.includes(type);
}
