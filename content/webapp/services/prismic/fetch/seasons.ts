import { fetcher } from '.';
import { SeasonsDocument } from '@weco/common/prismicio-types';

const fetchLinks = [];

const seasonsFetcher = fetcher<SeasonsDocument>('seasons', fetchLinks);

export const fetchSeason = seasonsFetcher.getById;
export const fetchSeasons = seasonsFetcher.getByType;
