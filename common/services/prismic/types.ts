/* eslint-disable camelcase */
export type PrismicDocument = {
  id: string;
  uid?: string;
  type: string;
  href: string;
  tags: string[];
  slug: string;
  slugs: string[];
  lang?: string;
  alternateLanguages: string[];
  first_publication_date: Date;
  last_publication_date: Date;
  data: Record<string, unknown>;
  isBroken: boolean | null;
  link_type?: string;
  url?: string;
};

// This is the type we want to convert prismic
// to as it mirrors the catalogue API
export type PaginatedResults<T> = {
  currentPage: number;
  results: T[];
  pageSize: number;
  totalResults: number;
  totalPages: number;
};
