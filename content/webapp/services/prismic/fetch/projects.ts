import { fetcher } from '.';
import { PagePrismicDocument } from '../types/pages';

const fetchLinks = [];

const projectsFetcher = fetcher<PagePrismicDocument>('projects', fetchLinks);

export const fetchProject = projectsFetcher.getById;
export const fetchProjects = projectsFetcher.getByType;
export const fetchProjectsClientSide = projectsFetcher.getByTypeClientSide;
