import { PrismicDocument, Query } from '@prismicio/types';
import { PopupDialogPrismicDocument } from './types';

export function emptyPrismicQuery<T extends PrismicDocument>(): Query<T> {
  return {
    page: 1,
    results_per_page: 0,
    results_size: 0,
    total_results_size: 0,
    total_pages: 0,
    next_page: null,
    prev_page: null,
    results: [] as T[],
  };
}

export function emptyDocument<T extends PrismicDocument>(
  data: T['data']
): PrismicDocument<T['data']> {
  return {
    id: '',
    uid: null,
    url: null,
    type: '',
    href: '',
    tags: [],
    first_publication_date: '',
    last_publication_date: '',
    slugs: [],
    linked_documents: [],
    lang: 'en-gb',
    alternate_languages: [],
    data,
  };
}

export function emptyPopupDialog(): PopupDialogPrismicDocument {
  return emptyDocument<PopupDialogPrismicDocument>({
    isShown: false,
    link: null,
    linkText: null,
    openButtonText: null,
    text: [],
    title: null,
  });
}
