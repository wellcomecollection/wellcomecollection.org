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
  'Article',
  'Book',
  'Event',
  'Event series',
  'Exhibition',
  'Exhibition highlight tour',
  'Exhibition text',
  'Page',
  'Project',
  'Season',
  'Visual story',
] as const;

const allContentTypes = [
  ...contentTypes,
  ...contentApiContentTypes,
  'exhibition-guides-links',
] as const;

export type ContentType = (typeof contentTypes)[number];
export type ContentApiContentType = (typeof contentApiContentTypes)[number];
export type AllContentType = (typeof allContentTypes)[number];

export function isContentType(type?: string): type is ContentType {
  return contentTypes.includes(type as ContentType);
}

export function isContentApiContentType(
  type: AllContentType
): type is ContentApiContentType {
  return contentApiContentTypes.includes(type as ContentApiContentType);
}

// We want to be able to treat Prismic and Content API content types as the same so we can test against single values in the link resolver
export const contentApiTypeMap = {
  Book: 'books',
  'Event series': 'event-series',
  Event: 'events',
  Exhibition: 'exhibitions',
  'Visual story': 'visual-stories',
  'Exhibition text': 'exhibition-texts',
  Page: 'pages',
  'Exhibition highlight tour': 'exhibition-highlight-tours',
  Project: 'projects',
  Article: 'articles',
  Season: 'seasons',
} as const;

export type ContentApiType =
  (typeof contentApiTypeMap)[keyof typeof contentApiTypeMap];
