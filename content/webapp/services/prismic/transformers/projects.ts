import { Project } from '../../../types/projects';
import { ProjectPrismicDocument } from '../types/projects';
import { transformGenericFields, transformSingleLevelGroup } from '.';
import { transformSeason } from './seasons';
import { SeasonPrismicDocument } from '../types/seasons';

export function transformProject(document: ProjectPrismicDocument): Project {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const seasons = transformSingleLevelGroup(data.seasons, 'season').map(season => {
    return transformSeason(season as SeasonPrismicDocument);
  });

  const promo = genericFields.promo;
  return {
    type: 'projects',
    ...genericFields,
    seasons,
    promo: promo && promo.image ? promo : undefined,
  };
}
