import * as prismic from '@prismicio/client';

import { ImageDimensions } from '@weco/common/model/image';
import {
  ArticleFormatsDocument as RawArticleFormatsDocument,
  ArticlesDocument as RawArticlesDocument,
  AudiencesDocument as RawAudiencesDocument,
  BooksDocument as RawBooksDocument,
  CardDocument as RawCardDocument,
  CollectionVenueDocument as RawCollectionVenueDocument,
  EditorialContributorRolesDocument as RawEditorialContributorRolesDocument,
  EventFormatsDocument as RawEventFormatsDocument,
  EventPoliciesDocument as RawEventPoliciesDocument,
  EventsDocument as RawEventsDocument,
  EventSeriesDocument as RawEventSeriesDocument,
  ExhibitionFormatsDocument as RawExhibitionFormatsDocument,
  ExhibitionsDocument as RawExhibitionsDocument,
  GuideFormatsDocument as RawGuideFormatsDocument,
  GuidesDocument as RawGuidesDocument,
  InterpretationTypesDocument as RawInterpretationTypesDocument,
  OrganisationsDocument as RawOrganisationsDocument,
  PageFormatsDocument as RawPageFormatsDocument,
  PagesDocument as RawPagesDocument,
  PagesDocumentData as RawPagesDocumentData,
  PeopleDocument as RawPeopleDocument,
  PlacesDocument as RawPlacesDocument,
  ProjectFormatsDocument as RawProjectFormatsDocument,
  ProjectsDocument as RawProjectsDocument,
  SeasonsDocument as RawSeasonsDocument,
  SeriesDocument as RawSeriesDocument,
  TeamsDocument as RawTeamsDocument,
  VisualStoriesDocument as RawVisualStoriesDocument,
  WebcomicsDocument as RawWebcomicsDocument,
} from '@weco/common/prismicio-types';
import {
  InferDataInterface,
  isFilledLinkToDocumentWithData,
} from '@weco/common/services/prismic/types';
export type InferCustomType<T> =
  T extends prismic.PrismicDocument<
    /* eslint-disable @typescript-eslint/no-explicit-any */
    any,
    /* eslint-enable @typescript-eslint/no-explicit-any */
    infer CustomType
  >
    ? CustomType
    : never;

/** This gives us type checking on fetch links.  e.g. if you have a type
 *
 *      type ShapePrismicDocument = { sides: prismic.NumberField, colour: prismic.KeyTextField };
 *
 * and you wanted to create fetchLinks, you could write:
 *
 *      const shapeFetchLinks: FetchLinks<ShapePrismicDocument> = ['shape.sides', 'shape.colour'];
 *
 * and it will check these are valid fetch links.  If you put in an invalid fetch
 * link (for example, 'shape.name'), this would be flagged by the type checker.
 *
 * This works by converting ShapePrismicDocument into ('shape.sides' | 'shape.colour')[].
 *
 * If we wanted to get all the fields, you could use `UnionToTuple<FetchLinks<T>>` and remove the array type.
 * Given that we mostly use this for fetching links, where we don't need the complete linked
 * document, this is better.
 *
 */
export type FetchLinks<T extends prismic.PrismicDocument> = {
  [D in keyof InferDataInterface<T>]: D extends string
    ? `${InferCustomType<T>}.${D}`
    : never;
}[keyof InferDataInterface<T>][];

// Currently the Prismic types only allow you to specify 1 image
type ThumbnailedImageField<Thumbnails extends Record<string, ImageDimensions>> =
  | (prismic.FilledImageFieldImage & {
      [Property in keyof Thumbnails]: prismic.FilledImageFieldImage;
    })
  | prismic.EmptyImageFieldImage;

export type Image = ThumbnailedImageField<{
  '32:15': {
    width: 3200;
    height: 1500;
  };
  '16:9': {
    width: 3200;
    height: 1800;
  };
  square: {
    width: 3200;
    height: 3200;
  };
}>;

type Promo = {
  caption: prismic.RichTextField;
  image: Image;
  link: prismic.KeyTextField;
};
export type PromoSliceZone = prismic.SliceZone<
  prismic.Slice<'editorialImage', Promo>
>;

export type GenericDocWithPromo =
  | RawArticlesDocument
  | RawBooksDocument
  | RawExhibitionsDocument
  | RawEventsDocument
  | RawEventSeriesDocument
  | RawGuidesDocument
  | RawPagesDocument;

export type GenericDoc =
  | GenericDocWithPromo
  | RawPlacesDocument
  | RawProjectsDocument
  | RawSeasonsDocument
  | RawSeriesDocument
  | RawVisualStoriesDocument
  | RawWebcomicsDocument;

export type GenericDocWithMetaDescription =
  | GenericDocWithPromo
  | RawProjectsDocument
  | RawSeriesDocument
  | RawWebcomicsDocument;

export type RelatedGenericDoc = prismic.FilledContentRelationshipField<
  | 'articles'
  | 'books'
  | 'exhibitions'
  | 'events'
  | 'event-series'
  | 'guides'
  | 'pages',
  string,
  RawPagesDocumentData
>;

export const isPage = (
  doc: prismic.FilledContentRelationshipField<
    | 'pages'
    | 'event-series'
    | 'books'
    | 'events'
    | 'articles'
    | 'exhibitions'
    | 'card'
    | 'seasons'
    | 'guides',
    'en-gb',
    RawPagesDocumentData
  >
): doc is prismic.FilledContentRelationshipField<
  'pages',
  'en-gb',
  RawPagesDocumentData
> => {
  return doc.type === 'pages';
};

// We need these for links in the `contentList` slice
export const commonPrismicFieldsFetchLinks = [
  'pages',
  'event-series',
  'books',
  'events',
  'articles',
  'exhibitions',
  'series',
  'webcomic-series',
  'webcomics',
].flatMap(type => [`${type}.title`, `${type}.promo`]);

// These fields are shared amongst a lot of types, but not all

export type WithEventSeries = {
  series: prismic.GroupField<{
    series: prismic.ContentRelationshipField<
      'series',
      'en-gb',
      InferDataInterface<RawEventSeriesDocument>
    >;
  }>;
};
export const eventSeriesFetchLinks: FetchLinks<RawEventSeriesDocument> = [
  'event-series.title',
  'event-series.promo',
];

export type WithSeasons = {
  seasons: prismic.GroupField<{
    season: prismic.ContentRelationshipField<
      'seasons',
      'en-gb',
      InferDataInterface<RawSeasonsDocument>
    >;
  }>;
};

export const seasonsFetchLinks: FetchLinks<RawSeasonsDocument> = [
  'seasons.title',
  'seasons.start',
  'seasons.end',
  'seasons.promo',
];

export const articleFormatsFetchLinks: FetchLinks<RawArticleFormatsDocument> = [
  'article-formats.title',
  'article-formats.description',
];

export const cardFetchLinks: FetchLinks<RawCardDocument> = [
  'card.title',
  'card.format',
  'card.description',
  'card.image',
  'card.link',
];

export const collectionVenuesFetchLinks: FetchLinks<RawCollectionVenueDocument> =
  [
    'collection-venue.title',
    'collection-venue.image',
    'collection-venue.link',
    'collection-venue.linkText',
    'collection-venue.order',
    'collection-venue.monday',
    'collection-venue.tuesday',
    'collection-venue.wednesday',
    'collection-venue.thursday',
    'collection-venue.friday',
    'collection-venue.saturday',
    'collection-venue.sunday',
    'collection-venue.modifiedDayOpeningTimes',
  ];

export const eventsFetchLinks: FetchLinks<RawEventsDocument> = [
  'events.title',
  'events.audiences',
  'events.schedule',
  'events.interpretations',
  'events.series',
  'events.times',
  'events.locations',
];

export const exhibitionFormatsFetchLinks: FetchLinks<RawExhibitionFormatsDocument> =
  ['exhibition-formats.title'];

export const eventPolicyFetchLinks: FetchLinks<RawEventPoliciesDocument> = [
  'event-policies.title',
  'event-policies.description',
];

export const projectFormatsFetchLinks: FetchLinks<RawProjectFormatsDocument> = [
  'project-formats.title',
];

export const eventFormatFetchLinks: FetchLinks<RawEventFormatsDocument> = [
  'event-formats.title',
  'event-formats.description',
];

export const interpretationTypeFetchLinks: FetchLinks<RawInterpretationTypesDocument> =
  [
    'interpretation-types.title',
    'interpretation-types.abbreviation',
    'interpretation-types.description',
    'interpretation-types.primaryDescription',
  ];

export const teamFetchLinks: FetchLinks<RawTeamsDocument> = [
  'teams.title',
  'teams.subtitle',
  'teams.email',
  'teams.phone',
];

export type WithExhibitionParents = {
  parents: prismic.GroupField<{
    order: prismic.NumberField;
    parent: prismic.ContentRelationshipField<
      'exhibitions',
      // We know this is an ExhibitionsDocument, but the type checker gets
      // unhappy about the circular reference:
      //
      //    'event' is referenced directly or indirectly in its own type annotation.
      //
      // TODO: Find a better way to do this which doesn't upset the type checker.
      /* eslint-disable @typescript-eslint/no-explicit-any */
      InferDataInterface<any>
      /* eslint-enable @typescript-eslint/no-explicit-any */
    >;
  }>;
};

export const seriesFetchLinks: FetchLinks<RawSeriesDocument> = [
  'series.title',
  'series.promo',
  'series.schedule',
  'series.color',
];

export const exhibitionsFetchLinks: FetchLinks<RawExhibitionsDocument> = [
  'exhibitions.title',
  'exhibitions.promo',
  'exhibitions.shortTitle',
  'exhibitions.format',
  'exhibitions.end',
];

type Contributor =
  | prismic.EmptyLinkField<'Document'>
  | prismic.FilledContentRelationshipField<'people', string, unknown>
  | prismic.FilledContentRelationshipField<'organisations', string, unknown>;

export type WithContributors = {
  contributorsTitle: prismic.RichTextField;
  contributors: prismic.GroupField<{
    role: prismic.ContentRelationshipField<string, string, unknown>;
    contributor: Contributor;
    description: prismic.RichTextField;
  }>;
};

export const audienceFetchLinks: FetchLinks<RawAudiencesDocument> = [
  'audiences.title',
  'audiences.description',
];

export const articlesFetchLinks: FetchLinks<RawArticlesDocument> = [
  'articles.title',
];

const contributionRoleFetchLinks: FetchLinks<RawEditorialContributorRolesDocument> =
  [
    'editorial-contributor-roles.title',
    'editorial-contributor-roles.describedBy',
  ];

export const guideFormatsFetchLinks: FetchLinks<RawGuideFormatsDocument> = [
  'guide-formats.title',
  'guide-formats.description',
];

export const guideFetchLinks: FetchLinks<RawGuidesDocument> = [
  'guides.title',
  'guides.promo',
];

const personFetchLinks: FetchLinks<RawPeopleDocument> = [
  'people.name',
  'people.description',
  'people.pronouns',
  'people.image',
  'people.sameAs',
];

const organisationFetchLinks: FetchLinks<RawOrganisationsDocument> = [
  'organisations.name',
  'organisations.description',
  'organisations.image',
  'organisations.sameAs',
];

export const bookFetchLinks: FetchLinks<RawBooksDocument> = ['books.title'];

export const pagesFetchLinks: FetchLinks<RawPagesDocument> = [
  'pages.title',
  'pages.promo',
];

export const contributorFetchLinks = [
  ...contributionRoleFetchLinks,
  ...personFetchLinks,
  ...organisationFetchLinks,
];

export const teamsFetchLinks: FetchLinks<RawTeamsDocument> = [
  'teams.title',
  'teams.subtitle',
  'teams.email',
  'teams.phone',
];

export const pageFormatsFetchLinks: FetchLinks<RawPageFormatsDocument> = [
  'page-formats.title',
  'page-formats.description',
];

export const placesFetchLinks: FetchLinks<RawPlacesDocument> = [
  'places.title',
  'places.geolocation',
  'places.level',
  'places.capacity',
  'places.locationInformation',
];

// Guards
export function isFilledLinkToPersonField(
  field: unknown
): field is prismic.FilledContentRelationshipField<
  'people',
  string,
  InferDataInterface<RawPeopleDocument>
> & {
  data: InferDataInterface<RawPeopleDocument>;
} {
  return (
    isFilledLinkToDocumentWithData(field as prismic.ContentRelationshipField) &&
    (field as prismic.FilledContentRelationshipField).type === 'people'
  );
}

export function isFilledLinkToOrganisationField(
  field: unknown
): field is prismic.FilledContentRelationshipField<
  'organisations',
  string,
  InferDataInterface<RawOrganisationsDocument>
> & { data: InferDataInterface<RawOrganisationsDocument> } {
  return (
    isFilledLinkToDocumentWithData(field as prismic.ContentRelationshipField) &&
    (field as prismic.FilledContentRelationshipField).type === 'organisations'
  );
}

export type MultiContentPrismicDocument =
  | RawPagesDocument
  | RawEventSeriesDocument
  | RawBooksDocument
  | RawEventsDocument
  | RawArticlesDocument
  | RawExhibitionsDocument
  | RawSeriesDocument
  | RawCardDocument
  | RawWebcomicsDocument;

export type StructuredSearchQuery = {
  types: string[];
  type: string[];
  ids: string[];
  id: string[];
  tags: string[];
  tag: string[];
  pageSize: number;
  orderings: prismic.Ordering[];
  // content type specific
  'article-series': string[];
};

export type WithCardFormat = {
  format: prismic.ContentRelationshipField;
};

export type ExhibitionRelatedContentPrismicDocument =
  | RawExhibitionsDocument
  | RawEventsDocument
  | RawArticlesDocument
  | RawBooksDocument;

export type WithArticleFormat = {
  format: prismic.ContentRelationshipField;
};

export type WithGuideFormat = {
  format: prismic.ContentRelationshipField;
};

export type WithPageFormat = {
  format: prismic.ContentRelationshipField;
};

export type WithProjectFormat = {
  format: prismic.ContentRelationshipField;
};

export type WithEventFormat = {
  format: prismic.ContentRelationshipField;
};
