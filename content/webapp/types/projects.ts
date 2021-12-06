import { Project as DeprecatedProject } from '@weco/common/model/projects';
import { Override } from '@weco/common/utils/utility-types';
import { ProjectPrismicDocument } from '../services/prismic/types/projects';

export type Project = Override<
  DeprecatedProject,
  {
    prismicDocument: ProjectPrismicDocument;
  }
>;
