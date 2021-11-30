/* eslint-disable camelcase */
import {
  PrismicDocument as PrismicDoc,
  NumberField,
  RichTextField,
  LinkField,
  GroupField,
  TimestampField,
  SelectField,
  KeyTextField,
  ImageField,
  BooleanField,
} from '@prismicio/types';

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

export type PrismicLink = {
  link_type: 'Web' | 'Document' | 'Media';
  url?: string;
  id?: string;
};

export type PrismicApiSearchResponse = {
  page: number;
  results_per_page: number;
  results_size: number;
  total_results_size: number;
  total_pages: number;
  next_page: string;
  prev_page: string;
  results: PrismicDocument[];
};

export type PrismicQueryOpts = {
  fetchLinks?: string[];
  page?: number;
  orderings?: string;
  pageSize?: number;
  graphQuery?: string;
};

export type HTMLSpanTypes =
  | 'heading2'
  | 'heading3'
  | 'paragraph'
  | 'strong'
  | 'em'
  | 'hyperlink'
  | 'strike'
  | 'list-item'
  | 'embed';

export type HTMLSpan = {
  type: HTMLSpanTypes;
  start: number;
  end: number;
  data?: Record<string, unknown>;
};

export type HTMLStringBlock = {
  type: HTMLSpanTypes;
  text: string;
  spans: HTMLSpan[];
};

export type HTMLString = HTMLStringBlock[];

export type PrismicFragment = Record<string, unknown>;

// This is the type we want to convert prismic
// to as it mirrors the catalogue API
export type PaginatedResults<T> = {
  currentPage: number;
  results: T[];
  pageSize: number;
  totalResults: number;
  totalPages: number;
};

export type PrismicApiError = {
  statusCode: number;
};

export type DocumentType =
  | 'articles'
  | 'webcomics'
  | 'events'
  | 'exhibitions'
  | 'books';

type DayField = GroupField<{
  startDateTime: TimestampField;
  endDateTime: TimestampField;
}>;

export type CollectionVenuePrismicDocument = PrismicDoc<{
  title: KeyTextField;
  order: NumberField;
  image: ImageField;
  link: LinkField;
  linkText: RichTextField;
  monday: DayField;
  tuesday: DayField;
  wednesday: DayField;
  thursday: DayField;
  friday: DayField;
  saturday: DayField;
  sunday: DayField;
  modifiedDayOpeningTimes: GroupField<{
    overrideDate: TimestampField;
    type: SelectField<
      | 'Bank holiday'
      | 'Easter'
      | 'Christmas and New Year'
      | 'Late Spectacular'
      | 'other'
    >;
    startDateTime: TimestampField;
    endDateTime: TimestampField;
  }>;
}>;

export type PopupDialogPrismicDocument = PrismicDoc<{
  openButtonText: KeyTextField;
  title: KeyTextField;
  text: RichTextField;
  linkText: KeyTextField;
  link: KeyTextField;
  isShown: BooleanField;
}>;
