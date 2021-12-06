import { fetcher } from '.';
import { PagePrismicDocument } from '../types/pages';

const fetchLinks = [];

const pagesFetcher = fetcher<PagePrismicDocument>('pages', fetchLinks);

export const fetchPage = pagesFetcher.getById;
export const fetchPages = pagesFetcher.getByType;
export const fetchPagesClientSide = pagesFetcher.getByTypeClientSide;
