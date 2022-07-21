type Doc = {
  id: string;
  type: string;
};

// TODO: we have an implementation of this in the content app to.
// Do we need both?
export function linkResolver(doc: Doc): string {
  switch (doc.type) {
    case 'articles':
      return `/articles/${doc.id}`;
    case 'webcomics':
      return `/articles/${doc.id}`;
    case 'exhibitions':
      return `/exhibitions/${doc.id}`;
    case 'events':
      return `/events/${doc.id}`;
    case 'series':
      return `/series/${doc.id}`;
    case 'webcomic-series':
      return `/series/${doc.id}`;
    case 'event-series':
      return `/event-series/${doc.id}`;
    case 'pages':
      return `/pages/${doc.id}`;
    case 'books':
      return `/books/${doc.id}`;
    case 'seasons':
      return `/seasons/${doc.id}`;
    case 'projects':
      return `/projects/${doc.id}`;
    case 'guides':
      return `/guides/${doc.id}`;
    case 'exhibition-guides':
      return `/guides/exhibitions/${doc.id}`;
    default:
      return '/';
  }
}
