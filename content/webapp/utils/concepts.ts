import { IdentifierType } from '@weco/common/model/catalogue';
import { Concept as ConceptType } from '@weco/content/services/wellcome/catalogue/types';

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

export const conceptTypeDisplayName = (conceptResponse: ConceptType) => {
  return conceptResponse.type === 'Genre'
    ? 'Type/Technique'
    : conceptResponse.type;
};

// In order to preserve the existing behaviour of search page filters,
// the All (Works|Images) links lead to a search for the label corresponding to
// the genre.
const linkKeys = {
  worksAbout: { filter: 'subjects.label', fields: ['label'] },
  worksBy: { filter: 'contributors.agent.label', fields: ['label'] },
  imagesAbout: { filter: 'source.subjects.label', fields: ['label'] },
  imagesBy: { filter: 'source.contributors.agent.label', fields: ['label'] },
  worksIn: { filter: 'genres.label', fields: ['label'] },
  imagesIn: { filter: 'source.genres.label', fields: ['label'] },
};

const keysById = {
  worksAbout: {
    filter: 'subjects',
    fields: ['id', 'sameAs'],
  },
  worksBy: {
    filter: 'contributors.agent',
    fields: ['id', 'sameAs'],
  },
  imagesAbout: {
    filter: 'source.subjects',
    fields: ['id', 'sameAs'],
  },
  imagesBy: {
    filter: 'source.contributors.agent',
    fields: ['id', 'sameAs'],
  },
  worksIn: {
    filter: 'genres',
    fields: ['id', 'sameAs'],
  },
  imagesIn: {
    filter: 'source.genres',
    fields: ['id', 'sameAs'],
  },
};

const gatherValues = (conceptResponse: ConceptType, fields: string[]) => {
  return fields.reduce(
    (acc, current) => acc.concat(conceptResponse[current]),
    []
  );
};

export const queryParams = (
  sectionName: string,
  conceptResponse: ConceptType
) => {
  const queryDefinition = keysById[sectionName];
  return {
    [queryDefinition.filter]: gatherValues(
      conceptResponse,
      queryDefinition.fields
    ),
  };
};

export const allRecordsLinkParams = (
  sectionName: string,
  conceptResponse: ConceptType
) => {
  const queryDefinition = linkKeys[sectionName];
  return {
    [queryDefinition.filter]: gatherValues(
      conceptResponse,
      queryDefinition.fields
    ),
  };
};
