import { fetcher } from '.';
import { PagePrismicDocument } from '../types/pages';

const fetchLinks = [];

const guidesFetcher = fetcher<PagePrismicDocument>('guides', fetchLinks);

export const fetchGuide = guidesFetcher.getById;
export const fetchGuides = guidesFetcher.getByType;
export const fetchGuidesClientSide = guidesFetcher.getByTypeClientSide;
