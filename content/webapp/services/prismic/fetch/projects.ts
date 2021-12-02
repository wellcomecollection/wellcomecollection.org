import { fetcher } from '.';
import { PagesPrismicDocument } from '../pages';

const fetchLinks = [];

const projectsFetcher = fetcher<PagesPrismicDocument>('projects', fetchLinks);

export const fetchProject = projectsFetcher.getById;
export const fetchProjects = projectsFetcher.getByType;
export const fetchProjectsClientSide = projectsFetcher.getByTypeClientSide;
