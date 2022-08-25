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
] as const;
export type ContentType = typeof contentTypes[number];

function isContentType(type: any): type is ContentType {
  return typeof type && contentTypes.includes(type);
}

/**
 * we use null as that's what prismic expects
 * {@link https://prismic.io/docs/technologies/link-resolver-javascript}
 */
function linkResolver(doc: { id: string; type: string }): string {
  const { id, type } = doc;

  if (type === 'webcomics') return `/articles/${id}`;
  if (type === 'webcomic-series') return `/series/${id}`;
  if (type === 'exhibition-guides') return `/guides/exhibitions/${id}`;

  if (isContentType(type)) {
    return `/${type}/${id}`;
  }

  return '/';
}

export default linkResolver;
