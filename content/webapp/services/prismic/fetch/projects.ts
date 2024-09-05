import { GetServerSidePropsPrismicClient, fetcher } from '.';
import { ProjectsDocument as RawProjectsDocument } from '@weco/common/prismicio-types';
import {
  contributorFetchLinks,
  projectFormatsFetchLinks,
  seasonsFetchLinks,
} from '@weco/content/services/prismic/types';

export const fetchLinks = [
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
  // TODO once redirects are in place we should only fetch by uid
  const projectDocument =
    (await projectsFetcher.getById(client, id)) ||
    (await projectsFetcher.getByUid(client, id));

  return projectDocument;
};
