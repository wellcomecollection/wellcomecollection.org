import { fetcher } from '.';
import { ProjectPrismicDocument } from '../types/projects';
import { projectFormatsFetchLinks as fetchLinks } from '../types';

const projectsFetcher = fetcher<ProjectPrismicDocument>('projects', fetchLinks);

export const fetchProject = projectsFetcher.getById;
export const fetchProjects = projectsFetcher.getByType;
export const fetchProjectsClientSide = projectsFetcher.getByTypeClientSide;
