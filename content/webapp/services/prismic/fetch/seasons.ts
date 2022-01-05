import { fetcher } from '.';
import { SeasonPrismicDocument } from '../types/seasons';

const fetchLinks = [];

const seasonsFetcher = fetcher<SeasonPrismicDocument>('seasons', fetchLinks);

export const fetchSeason = seasonsFetcher.getById;
export const fetchSeasons = seasonsFetcher.getByType;
export const fetchSeasonsClientSide = seasonsFetcher.getByTypeClientSide;
