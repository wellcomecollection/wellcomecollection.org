import { Concept } from '@weco/content/services/wellcome/catalogue/types';

export const concept: Concept = {
  id: 'abc123',
  label: 'Test Concept',
  displayLabel: 'Test Concept Display',
  type: 'Subject',
  description: {
    sourceLabel: 'nlm-mesh',
    sourceUrl: 'https://example.com',
    text: 'A test concept for unit testing',
  },
  alternativeLabels: ['Alternative Label 1', 'Alternative Label 2'],
  identifiers: [
    {
      identifierType: {
        id: 'nlm-mesh',
        label: 'NLM MeSH',
        type: 'IdentifierType',
      },
      value: 'D123456',
      type: 'Identifier',
    },
  ],
};

export const conceptsApiResponse = {
  type: 'ResultList' as const,
  totalResults: 1,
  totalPages: 1,
  results: [concept],
  pageSize: 20,
  prevPage: null,
  nextPage: null,
  aggregations: {
    type: 'Aggregations' as const,
  },
  _requestUrl:
    'https://api.wellcomecollection.org/catalogue/v2/concepts?query=test',
};
