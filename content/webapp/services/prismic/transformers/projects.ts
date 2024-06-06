import { Project } from '../../../types/projects';
import {
  transformFormat,
  transformGenericFields,
  transformSingleLevelGroup,
} from '.';
import { transformSeason } from './seasons';
import {
  SeasonsDocument,
  ProjectsDocument,
} from '@weco/common/prismicio-types';

export function transformProject(document: ProjectsDocument): Project {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const seasons = transformSingleLevelGroup(data.seasons, 'season').map(
    season => {
      return transformSeason(season as SeasonsDocument);
    }
  );

  const promo = genericFields.promo;
  return {
    type: 'projects',
    ...genericFields,
    format: transformFormat(document),
    seasons,
    promo: promo && promo.image ? promo : undefined,
  };
}
