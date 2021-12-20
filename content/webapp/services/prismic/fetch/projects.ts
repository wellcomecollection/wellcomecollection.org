import { fetcher } from '.';
import { ProjectPrismicDocument } from '../types/projects';

const fetchLinks = [];

const projectsFetcher = fetcher<ProjectPrismicDocument>('projects', fetchLinks);

export const fetchProject = projectsFetcher.getById;
export const fetchProjects = projectsFetcher.getByType;
export const fetchProjectsClientSide = projectsFetcher.getByTypeClientSide;
