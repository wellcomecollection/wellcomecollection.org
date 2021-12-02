import { PrismicDocument } from '@prismicio/types';

/**
 * we use null as that's what prismic expects
 * {@link https://prismic.io/docs/technologies/link-resolver-javascript}
 */
function linkResolver(document: PrismicDocument): string | null {
  switch (document.type) {
    /**
     * articles and webcomics share the same functionality as we
     * can't change the types of documents in Prismic.
     * {@link} https://community.prismic.io/t/import-export-change-type-of-imported-document/7814
     */
    case 'articles':
    case 'webcomics':
      return `/articles/${document.id}`;
    case 'series':
      return `/series/${document.id}`;
    case 'webcomic-series':
      return `/series/${document.id}`;
    case 'exhibitions':
    case 'events':
    case 'event-series':
    case 'books':
    case 'pages':
    case 'seasons':
    case 'projects':
    case 'guides':
      return `/${document.type}/${document.id}`;
    default:
      return null;
  }
}

export default linkResolver;
