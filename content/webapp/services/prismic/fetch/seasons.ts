import { SeasonsDocument as RawSeasonsDocument } from '@weco/common/prismicio-types';

import { fetcher, GetServerSidePropsPrismicClient } from '.';

const fetchLinks = [];

const seasonsFetcher = fetcher<RawSeasonsDocument>('seasons', fetchLinks);

export const fetchSeasons = seasonsFetcher.getByType;

export const fetchSeason = async (
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<RawSeasonsDocument | undefined> => {
  // TODO once redirects are in place we should only fetch by uid
  const seasonDocument =
    (await seasonsFetcher.getById(client, id)) ||
    (await seasonsFetcher.getByUid(client, id));

  return seasonDocument;
};
