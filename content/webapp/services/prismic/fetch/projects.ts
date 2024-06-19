import { fetcher } from '.';
import { ProjectsDocument as RawProjectsDocument } from '@weco/common/prismicio-types';
import { projectFormatsFetchLinks as fetchLinks } from '../types';

const projectsFetcher = fetcher<RawProjectsDocument>('projects', fetchLinks);

export const fetchProject = projectsFetcher.getById;
export const fetchProjects = projectsFetcher.getByType;
