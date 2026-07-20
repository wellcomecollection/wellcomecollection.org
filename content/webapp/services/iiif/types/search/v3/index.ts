// The IIIF Content Search response for a manifest's search service:
// https://iiif.io/api/search/1.0/#response
// @iiif/presentation-3 has a SearchServiceSearchResponse type, but it types
// resource and on loosely (any) and omits the within.total and startIndex
// properties we rely on, so we keep our own definition.
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
