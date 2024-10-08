import { ProjectsDocument as RawProjectsDocument } from '@weco/common/prismicio-types';
import {
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  projectFormatsFetchLinks,
  seasonsFetchLinks,
} from '@weco/content/services/prismic/types';

import { fetcher, GetServerSidePropsPrismicClient } from '.';

export const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...contributorFetchLinks,
  ...projectFormatsFetchLinks,
  ...seasonsFetchLinks,
];

const projectsFetcher = fetcher<RawProjectsDocument>('projects', fetchLinks);

export const fetchProjects = projectsFetcher.getByType;
export const fetchProject = async (
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<RawProjectsDocument | undefined> => {
  // #11240 once redirects are in place we should only fetch by uid
  const projectDocument =
    (await projectsFetcher.getByUid(client, id)) ||
    (await projectsFetcher.getById(client, id));

  return projectDocument;
};
