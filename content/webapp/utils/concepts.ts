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
const commonKeys = {
  worksAbout: { filter: 'subjects.label', fields: ['label'] },
  worksBy: { filter: 'contributors.agent.label', fields: ['label'] },
  imagesAbout: { filter: 'source.subjects.label', fields: ['label'] },
  imagesBy: { filter: 'source.contributors.agent.label', fields: ['label'] },
};

// Definition of the fields used to populate each section
// of the page, and to define the link to the "all" searches.
// Currently, only genres use the id to filter
// the corresponding works.  As we make the identifiers available
// for the other queries, they can be changed here.
// In keeping with our API faceting principles, only the filters that
// do not operate on the id have the full path to the attribute.
const queryOnlyKeys = {
  worksIn: { filter: 'genres.concepts', fields: ['id', 'sameAs'] },
  imagesIn: { filter: 'source.genres.concepts', fields: ['id', 'sameAs'] },
};

// In order to preserve the existing behaviour of search page filters,
// the All (Works|Images) links lead to a search for the label corresponding to
// the genre.
// Currently, this matches the label of the genre, rather than individual concept
// so in some edge situations may not be "correct".  However most genres are
// not compound, and amongst those that are, many documents also have the main
// genre of the compound as a separate genre on its own
const linkOnlyKeys = {
  worksIn: { filter: 'genres.label', fields: ['label'] },
  imagesIn: { filter: 'source.genres.label', fields: ['label'] },
};

const queryKeys = {
  ...commonKeys,
  ...queryOnlyKeys,
};

const linkKeys = {
  ...commonKeys,
  ...linkOnlyKeys,
};

const keysById = {
  worksAbout: {
    filter: 'subjects.concepts',
    fields: ['id', 'sameAs'],
  },
  worksBy: {
    filter: 'contributors.concepts',
    fields: ['id', 'sameAs'],
  },
  imagesAbout: {
    filter: 'source.subjects.concepts',
    fields: ['id', 'sameAs'],
  },
  imagesBy: {
    filter: 'source.contributors.concepts',
    fields: ['id', 'sameAs'],
  },
  worksIn: {
    filter: 'genres.concepts',
    fields: ['id', 'sameAs'],
  },
  imagesIn: {
    filter: 'source.genres.concepts',
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
  const queryDefinition = queryKeys[sectionName];
  return {
    [queryDefinition.filter]: gatherValues(
      conceptResponse,
      queryDefinition.fields
    ),
  };
};

export const queryParamsById = (
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
