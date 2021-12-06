import { fetcher } from '.';
import { seriesFetchLinks, SeriesPrismicDocument } from '../series';

const fetchLinks = seriesFetchLinks;

const seriesFetcher = fetcher<SeriesPrismicDocument>('series', fetchLinks);

export const fetchSeriesById = seriesFetcher.getById;
export const fetchSeries = seriesFetcher.getByType;
export const fetchSeriesClientSide = seriesFetcher.getByTypeClientSide;
