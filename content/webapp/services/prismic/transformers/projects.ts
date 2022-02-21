import { Project } from '../../../types/projects';
import { ProjectPrismicDocument } from '../types/projects';
import { parseSingleLevelGroup } from '@weco/common/services/prismic/parsers';
import { parseSeason } from '@weco/common/services/prismic/seasons';
import { transformGenericFields } from '.';

export function transformProject(document: ProjectPrismicDocument): Project {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const seasons = parseSingleLevelGroup(data.seasons, 'season').map(season => {
    return parseSeason(season);
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
