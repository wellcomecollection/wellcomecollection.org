// @flow
export type PrismicDocument = {|
  id: string;
  uid ?: string;
  type: string;
  href: string;
  tags: string[];
  slug: string;
  slugs: string[];
  lang ?: string;
  alternateLanguages: string[];
  firstPublicationDate: Date | null;
  lastPublicationDate: Date | null;
  data: any;
|}

export type PrismicQueryOpts = {|
  fetchLinks?: string[],
  page?: number,
  orderings?: string
|}

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
  start: number,
  end: number,
  data: Object
|}

export type HTMLString = [{|
  type: HTMLSpanTypes,
  text: string,
  spans: HTMLSpan[]
|}];

export type PrismicFragment = Object;
