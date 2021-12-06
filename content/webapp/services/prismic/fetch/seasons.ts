import { fetcher } from '.';
import { SeriesPrismicDocument } from '../series';

const fetchLinks = [];

const seasonsFetcher = fetcher<SeriesPrismicDocument>('series', fetchLinks);

export const fetchSeason = seasonsFetcher.getById;
export const fetchSeasons = seasonsFetcher.getByType;
export const fetchSeasonsClientSide = seasonsFetcher.getByTypeClientSide;
