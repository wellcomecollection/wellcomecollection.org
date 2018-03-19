// @flow
export type Document = {|
  id: string,
  uid ?: string,
  type: string,
  href: string,
  tags: string[],
  slug: string,
  slugs: string[],
  lang?: string,
  alternateLanguages: string[],
  firstPublicationDate: Date | null,
  lastPublicationDate: Date | null,
  data: any
|}

export type ApiSearchResponse = {
  page: number,
  results_per_page: number,
  results_size: number,
  total_results_size: number,
  total_pages: number,
  next_page: string,
  prev_page: string,
  results: Document[]
}

export type PrismicQueryOpts = {|
  fetchLinks?: string[],
  page?: number,
  orderings?: string
|}

export type DocumentTypes =
  | 'articles'
  | 'events'
  | 'exhibitions'
  | 'event-series'
  | 'series'
  | 'webcomic-series';
