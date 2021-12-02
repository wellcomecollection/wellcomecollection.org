import { fetcher } from '.';
import { PagesPrismicDocument } from '../pages';

const fetchLinks = [];

const pagesFetcher = fetcher<PagesPrismicDocument>('pages', fetchLinks);

export const fetchPage = pagesFetcher.getById;
export const fetchPages = pagesFetcher.getByType;
export const fetchPagesClientSide = pagesFetcher.getByTypeClientSide;
