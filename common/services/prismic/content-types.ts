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
] as const;

export type ContentType = typeof contentTypes[number];

export function isContentType(type: any): type is ContentType {
  return typeof type && contentTypes.includes(type);
}
