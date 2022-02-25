// @flow
export type PrismicDocument = {|
  id: string,
  uid?: string,
  type: string,
  href: string,
  tags: string[],
  slug: string,
  slugs: string[],
  lang?: string,
  alternateLanguages: string[],
  first_publication_date: Date,
  last_publication_date: Date,
  data: any,
  isBroken: ?boolean,
  link_type?: string,
  url?: string,
|};

export type HTMLSpanTypes =
  | 'heading2'
  | 'paragraph'
  | 'strong'
  | 'em'
  | 'hyperlink'
  | 'strike'
  | 'list-item'
  | 'embed';

export type HTMLSpan = {|
  type: HTMLSpanTypes,
  start: number,
  end: number,
  data: Object,
|};

export type HTMLStringBlock = {|
  type: HTMLSpanTypes,
  text: string,
  spans: HTMLSpan[],
|};

export type HTMLString = HTMLStringBlock[];

// This is the type we want to convert prismic
// to as it mirrors the catalogue API
export type PaginatedResults<T> = {|
  currentPage: number,
  results: T[],
  pageSize: number,
  totalResults: number,
  totalPages: number,
|};
