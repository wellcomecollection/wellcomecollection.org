import { SeasonsDocument as RawSeasonsDocument } from '@weco/common/prismicio-types';

import { fetcher, GetServerSidePropsPrismicClient } from '.';

const fetchLinks = [];

const seasonsFetcher = fetcher<RawSeasonsDocument>('seasons', fetchLinks);

export const fetchSeasons = seasonsFetcher.getByType;

export const fetchSeason = async (
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<RawSeasonsDocument | undefined> => {
  // #11240 once redirects are in place we should only fetch by uid
  const seasonDocument =
    (await seasonsFetcher.getByUid(client, id)) ||
    (await seasonsFetcher.getById(client, id));

  return seasonDocument;
};
