import { parsePage } from '@weco/common/services/prismic/pages';
import { Project as DeprecatedProject } from '@weco/common/model/projects';
import { Project } from '../../../types/projects';
import { ProjectPrismicDocument } from '../types/projects';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function transformProject(document: ProjectPrismicDocument): Project {
  const project: DeprecatedProject = parsePage(document);

  return {
    ...project,
    prismicDocument: document,
  };
}
