export type SearchResults = {
  '@context': string;
  '@id': string;
  '@type': string;
  within: {
    '@type': string;
    total: number | null;
  };
  startIndex: number;
  resources: {
    '@id': string;
    '@type': 'oa:Annotation';
    motivation: string;
    resource: {
      '@type': string;
      chars: string;
    };
    on: string;
  }[];
  hits: {
    '@type': string;
    annotations: string[];
    match: string;
    before: string;
    after: string;
  }[];
};
