import { Project } from '../../../types/projects';
import {
  transformFormat,
  transformGenericFields,
  transformSingleLevelGroup,
} from '.';
import { transformSeason } from './seasons';
import {
  SeasonsDocument as RawSeasonsDocument,
  ProjectsDocument as RawProjectsDocument,
} from '@weco/common/prismicio-types';

export function transformProject(document: RawProjectsDocument): Project {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const seasons = transformSingleLevelGroup(data.seasons, 'season').map(
    season => {
      return transformSeason(season as RawSeasonsDocument);
    }
  );

  const promo = genericFields.promo;
  return {
    type: 'projects',
    uid: document.uid,
    ...genericFields,
    format: transformFormat(document),
    seasons,
    promo: promo && promo.image ? promo : undefined,
  };
}
