import { fetcher } from '.';
import { ProjectsDocument } from '@weco/common/prismicio-types';
import { projectFormatsFetchLinks as fetchLinks } from '../types';

const projectsFetcher = fetcher<ProjectsDocument>('projects', fetchLinks);

export const fetchProject = projectsFetcher.getById;
export const fetchProjects = projectsFetcher.getByType;
