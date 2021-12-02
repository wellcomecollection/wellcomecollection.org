import { fetcher } from '.';
import { SeriesPrismicDocument } from '../series';

const fetchLinks = [];

const seriesFetcher = fetcher<SeriesPrismicDocument>('series', fetchLinks);

export const fetchSeriesById = seriesFetcher.getById;
export const fetchSeries = seriesFetcher.getByType;
export const fetchSeriesClientSide = seriesFetcher.getByTypeClientSide;
