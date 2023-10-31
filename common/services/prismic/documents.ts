/**
 * Most documents would live in the content app, but because these are universal,
 * i.e opening times, global alert, and the popup dialog, we have them in common
 */
import * as prismic from '@prismicio/client';

export type DayField = prismic.GroupField<{
  startDateTime: prismic.TimestampField;
  endDateTime: prismic.TimestampField;
}>;

export type ModifiedDayOpeningTime = {
  overrideDate: prismic.TimestampField;
  type: prismic.SelectField<
    | 'Bank holiday'
    | 'Easter'
    | 'Christmas and New Year'
    | 'Late Spectacular'
    | 'other'
  >;
  startDateTime: prismic.TimestampField;
  endDateTime: prismic.TimestampField;
};

export type CollectionVenuePrismicDocument = prismic.PrismicDocument<{
  title: prismic.KeyTextField;
  order: prismic.NumberField;
  image: prismic.ImageField;
  link: prismic.LinkField;
  linkText: prismic.RichTextField;
  monday: DayField;
  tuesday: DayField;
  wednesday: DayField;
  thursday: DayField;
  friday: DayField;
  saturday: DayField;
  sunday: DayField;
  modifiedDayOpeningTimes: prismic.GroupField<ModifiedDayOpeningTime>;
}>;

export type GlobalAlertPrismicDocument = prismic.PrismicDocument<{
  text: prismic.RichTextField;
  isShown: prismic.SelectField<'hide' | 'show'>;
  routeRegex: prismic.KeyTextField;
}>;

export type PopupDialogPrismicDocument = prismic.PrismicDocument<{
  openButtonText: prismic.KeyTextField;
  title: prismic.KeyTextField;
  text: prismic.RichTextField;
  linkText: prismic.KeyTextField;
  link: prismic.LinkField;
  isShown: prismic.BooleanField;
}>;

export function emptyPrismicQuery<
  T extends prismic.PrismicDocument,
>(): prismic.Query<T> {
  return {
    page: 1,
    results_per_page: 0,
    results_size: 0,
    total_results_size: 0,
    total_pages: 0,
    next_page: null,
    prev_page: null,
    results: [] as T[],
  };
}

export function emptyDocument<T extends prismic.PrismicDocument>(
  data: T['data']
): prismic.PrismicDocument<T['data']> {
  return {
    id: '',
    uid: null,
    url: null,
    type: '',
    href: '',
    tags: [],
    first_publication_date: '2020-06-29T15:13:27+0000',
    last_publication_date: '2020-06-29T15:13:27+0000',
    slugs: [],
    linked_documents: [],
    lang: 'en-gb',
    alternate_languages: [],
    data,
  };
}

export function emptyGlobalAlert(
  overrides: Partial<GlobalAlertPrismicDocument['data']> = {}
): GlobalAlertPrismicDocument {
  return emptyDocument<GlobalAlertPrismicDocument>({
    isShown: null,
    routeRegex: null,
    text: [],
    ...overrides,
  });
}

export function emptyPopupDialog(): PopupDialogPrismicDocument {
  return emptyDocument<PopupDialogPrismicDocument>({
    isShown: false,
    link: { link_type: 'Web' },
    linkText: null,
    openButtonText: null,
    text: [],
    title: null,
  });
}
