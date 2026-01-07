import { SeasonsDocument as RawSeasonsDocument } from '@weco/common/prismicio-types';

import { fetcher, GetServerSidePropsPrismicClient } from '.';

const fetchLinks = [];

const seasonsFetcher = fetcher<RawSeasonsDocument>('seasons', fetchLinks);

export const fetchSeasons = seasonsFetcher.getByType;

export const fetchSeason = async (
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<RawSeasonsDocument | undefined> => {
  const seasonDocument =
    (await seasonsFetcher.getByUid(client, id)) ||
    (await seasonsFetcher.getById(client, id));

  return seasonDocument;
};
