import { Project } from '../../../types/projects';
import { ProjectPrismicDocument } from '../types/projects';
import { parseSingleLevelGroup } from '@weco/common/services/prismic/parsers';
import { transformGenericFields } from '.';
import { transformSeason } from './seasons';

export function transformProject(document: ProjectPrismicDocument): Project {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const seasons = parseSingleLevelGroup(data.seasons, 'season').map(season => {
    return transformSeason(season);
  });

  const promo = genericFields.promo;
  return {
    type: 'projects',
    ...genericFields,
    seasons,
    promo: promo && promo.image ? promo : undefined,
    prismicDocument: document,
  };
}
