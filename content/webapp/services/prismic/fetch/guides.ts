import { fetcher } from '.';
import { PagesPrismicDocument } from '../pages';

const fetchLinks = [];

const guidesFetcher = fetcher<PagesPrismicDocument>('guides', fetchLinks);

export const fetchGuide = guidesFetcher.getById;
export const fetchGuides = guidesFetcher.getByType;
export const fetchGuidesClientSide = guidesFetcher.getByTypeClientSide;
