import { fetcher } from '.';
import { SeasonsDocument as RawSeasonsDocument } from '@weco/common/prismicio-types';

const fetchLinks = [];

const seasonsFetcher = fetcher<RawSeasonsDocument>('seasons', fetchLinks);

export const fetchSeason = seasonsFetcher.getById;
export const fetchSeasons = seasonsFetcher.getByType;
