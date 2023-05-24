/**
 * Most documents would live in the content app, but because these are universal,
 * i.e opening times, global alert, and the popup dialog, we have them in common
 */
import {
  Query,
  PrismicDocument,
  NumberField,
  RichTextField,
  LinkField,
  GroupField,
  TimestampField,
  SelectField,
  KeyTextField,
  ImageField,
  BooleanField,
} from '@prismicio/client';

export type DayField = GroupField<{
  startDateTime: TimestampField;
  endDateTime: TimestampField;
}>;

export type ModifiedDayOpeningTime = {
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
};

export type CollectionVenuePrismicDocument = PrismicDocument<{
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
  modifiedDayOpeningTimes: GroupField<ModifiedDayOpeningTime>;
}>;

export type GlobalAlertPrismicDocument = PrismicDocument<{
  text: RichTextField;
  isShown: SelectField<'hide' | 'show'>;
  routeRegex: KeyTextField;
}>;

export type PopupDialogPrismicDocument = PrismicDocument<{
  openButtonText: KeyTextField;
  title: KeyTextField;
  text: RichTextField;
  linkText: KeyTextField;
  link: LinkField;
  isShown: BooleanField;
}>;

export function emptyPrismicQuery<T extends PrismicDocument>(): Query<T> {
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

export function emptyDocument<T extends PrismicDocument>(
  data: T['data']
): PrismicDocument<T['data']> {
  return {
    id: '',
    uid: null,
    url: null,
    type: '',
    href: '',
    tags: [],
    first_publication_date: '',
    last_publication_date: '',
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
