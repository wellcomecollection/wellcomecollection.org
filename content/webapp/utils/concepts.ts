import { IdentifierType } from '@weco/common/model/catalogue';
import { Concept } from '@weco/content/services/wellcome/catalogue/types';

export function getDisplayIdentifierType(
  identifierType: IdentifierType
): string {
  switch (identifierType.id) {
    case 'lc-names':
      return 'LC Names';
    case 'lc-subjects':
      return 'LCSH';
    case 'nlm-mesh':
      return 'MeSH';
    default:
      return identifierType.label;
  }
}

// In order to preserve the existing behaviour of search page filters,
// the All (Works|Images) links lead to a search for the label corresponding to
// the genre.
const linkKeys = {
  worksAbout: { filter: 'subjects.label', fields: ['displayLabel'] },
  worksBy: { filter: 'contributors.agent.label', fields: ['displayLabel'] },
  imagesAbout: { filter: 'source.subjects.label', fields: ['label'] },
  imagesBy: {
    filter: 'source.contributors.agent.label',
    fields: ['label'],
  },
  worksIn: { filter: 'genres.label', fields: ['displayLabel'] },
  imagesIn: { filter: 'source.genres.label', fields: ['label'] },
};

const keysById = {
  worksAbout: {
    filters: ['subjects'],
    fields: ['id', 'sameAs'],
  },
  worksBy: {
    filters: ['contributors.agent'],
    fields: ['id', 'sameAs'],
  },
  imagesAbout: {
    filters: ['source.subjects'],
    fields: ['id', 'sameAs'],
  },
  imagesBy: {
    filters: ['source.contributors.agent'],
    fields: ['id', 'sameAs'],
  },
  worksIn: {
    filters: ['genres'],
    fields: ['id', 'sameAs'],
  },
  imagesIn: {
    filters: ['source.genres'],
    fields: ['id', 'sameAs'],
  },
};

const gatherValues = (concept: Concept, fields: string[]) => {
  return fields.reduce((acc, current) => acc.concat(concept[current]), []);
};

export const queryParams = (sectionName: string, concept: Concept) => {
  const queryParams = {};
  const queryDefinition = keysById[sectionName];
  queryDefinition.filters.forEach(filter => {
    queryParams[filter] = gatherValues(concept, queryDefinition.fields);
  });

  return queryParams;
};

export const allRecordsLinkParams = (sectionName: string, concept: Concept) => {
  const queryDefinition = linkKeys[sectionName];
  return {
    [queryDefinition.filter]: gatherValues(concept, queryDefinition.fields),
  };
};
