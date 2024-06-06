import * as prismic from '@prismicio/client';
import {
  ArticlesDocument,
  ArticleFormatsDocument,
  AudiencesDocument,
  BackgroundTexturesDocument,
  BooksDocument,
  CardDocument,
  CollectionVenueDocument,
  EventFormatsDocument,
  EventsDocument,
  EventPoliciesDocument,
  ExhibitionFormatsDocument,
  ExhibitionsDocument,
  GuidesDocument,
  GuideFormatsDocument,
  PagesDocument,
  PageFormatsDocument,
  ProjectsDocument,
  ProjectFormatsDocument,
  EditorialContributorRolesDocument,
  OrganisationsDocument,
  PeopleDocument,
  PlacesDocument,
  EventSeriesDocument,
  SeasonsDocument,
  SeriesDocument,
  TeamsDocument,
  InterpretationTypesDocument,
  WebcomicsDocument,
  VisualStoriesDocument,
  PagesDocumentData,
} from '@weco/common/prismicio-types';
import {
  isFilledLinkToDocumentWithData,
  InferDataInterface,
} from '@weco/common/services/prismic/types';
import { ImageDimensions } from '@weco/common/model/image';
export type InferCustomType<T> = T extends prismic.PrismicDocument<
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
  | ArticlesDocument
  | BooksDocument
  | ExhibitionsDocument
  | EventsDocument
  | EventSeriesDocument
  | GuidesDocument
  | PagesDocument;

export type GenericDoc =
  | GenericDocWithPromo
  | PlacesDocument
  | ProjectsDocument
  | SeasonsDocument
  | SeriesDocument
  | VisualStoriesDocument
  | WebcomicsDocument;

export type GenericDocWithMetaDescription =
  | GenericDocWithPromo
  | ProjectsDocument
  | SeriesDocument
  | WebcomicsDocument;

export type RelatedGenericDoc = prismic.FilledContentRelationshipField<
  | 'articles'
  | 'books'
  | 'exhibitions'
  | 'events'
  | 'event-series'
  | 'guides'
  | 'pages',
  string,
  PagesDocumentData
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
    PagesDocumentData
  >
): doc is prismic.FilledContentRelationshipField<
  'pages',
  'en-gb',
  PagesDocumentData
> => {
  return doc.type === 'pages';
};

// We need these for links in the `contentList` slice
export const commonPrismicFieldsFetchLinks = [
  // TODO move these type of things to utils file
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
      InferDataInterface<EventSeriesDocument>
    >;
  }>;
};
export const eventSeriesFetchLinks: FetchLinks<EventSeriesDocument> = [
  'event-series.title',
  'event-series.backgroundTexture',
  'event-series.promo',
];

export type WithSeasons = {
  seasons: prismic.GroupField<{
    season: prismic.ContentRelationshipField<
      'seasons',
      'en-gb',
      InferDataInterface<SeasonsDocument>
    >;
  }>;
};

export const seasonsFetchLinks: FetchLinks<SeasonsDocument> = [
  'seasons.title',
  'seasons.start',
  'seasons.end',
  'seasons.promo',
];

export const articleFormatsFetchLinks: FetchLinks<ArticleFormatsDocument> = [
  'article-formats.title',
  'article-formats.description',
];

export const cardFetchLinks: FetchLinks<CardDocument> = [
  'card.title',
  'card.format',
  'card.description',
  'card.image',
  'card.link',
];

export const collectionVenuesFetchLinks: FetchLinks<CollectionVenueDocument> = [
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

export const eventsFetchLinks: FetchLinks<EventsDocument> = [
  'events.title',
  'events.audiences',
  'events.schedule',
  'events.interpretations',
  'events.series',
  'events.times',
  'events.locations',
];

export const exhibitionFormatsFetchLinks: FetchLinks<ExhibitionFormatsDocument> =
  ['exhibition-formats.title'];

export const eventPolicyFetchLinks: FetchLinks<EventPoliciesDocument> = [
  'event-policies.title',
  'event-policies.description',
];

export const projectFormatsFetchLinks: FetchLinks<ProjectFormatsDocument> = [
  'project-formats.title',
];

export const eventFormatFetchLinks: FetchLinks<EventFormatsDocument> = [
  'event-formats.title',
  'event-formats.description',
];

export const interpretationTypeFetchLinks: FetchLinks<InterpretationTypesDocument> =
  [
    'interpretation-types.title',
    'interpretation-types.abbreviation',
    'interpretation-types.description',
    'interpretation-types.primaryDescription',
  ];

export const teamFetchLinks: FetchLinks<TeamsDocument> = [
  'teams.title',
  'teams.subtitle',
  'teams.email',
  'teams.phone',
  'teams.url',
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

export const seriesFetchLinks: FetchLinks<SeriesDocument> = [
  'series.title',
  'series.promo',
  'series.schedule',
  'series.color',
];

export const exhibitionsFetchLinks: FetchLinks<ExhibitionsDocument> = [
  'exhibitions.title',
  'exhibitions.promo',
  'exhibitions.shortTitle',
  'exhibitions.format',
];

type Contributor =
  | prismic.EmptyLinkField<'Document'>
  | prismic.FilledContentRelationshipField<
      'people',
      'en-gb',
      InferDataInterface<PeopleDocument>
    >
  | prismic.FilledContentRelationshipField<
      'organisations',
      'en-gb',
      InferDataInterface<OrganisationsDocument>
    >;

export type WithContributors = {
  contributorsTitle: prismic.RichTextField;
  contributors: prismic.GroupField<{
    role: prismic.ContentRelationshipField<
      'editorial-contributor-roles',
      'en-gb',
      InferDataInterface<EditorialContributorRolesDocument>
    >;
    contributor: Contributor;
    description: prismic.RichTextField;
  }>;
};

export const audienceFetchLinks: FetchLinks<AudiencesDocument> = [
  'audiences.title',
  'audiences.description',
];

export const articlesFetchLinks: FetchLinks<ArticlesDocument> = [
  'articles.title',
];

export const backgroundTexturesFetchLinks: FetchLinks<BackgroundTexturesDocument> =
  ['background-textures.name', 'background-textures.image'];

const contributionRoleFetchLinks: FetchLinks<EditorialContributorRolesDocument> =
  [
    'editorial-contributor-roles.title',
    'editorial-contributor-roles.describedBy',
  ];

export const guideFormatsFetchLinks: FetchLinks<GuideFormatsDocument> = [
  'guide-formats.title',
  'guide-formats.description',
];

export const guideFetchLinks: FetchLinks<GuidesDocument> = [
  'guides.title',
  'guides.promo',
];

const personFetchLinks: FetchLinks<PeopleDocument> = [
  'people.name',
  'people.description',
  'people.pronouns',
  'people.image',
  'people.sameAs',
];

const organisationFetchLinks: FetchLinks<OrganisationsDocument> = [
  'organisations.name',
  'organisations.description',
  'organisations.image',
  'organisations.sameAs',
];

export const bookFetchLinks: FetchLinks<BooksDocument> = ['books.title'];

export const pagesFetchLinks: FetchLinks<PagesDocument> = [
  'pages.title',
  'pages.promo',
];

export const contributorFetchLinks = [
  ...contributionRoleFetchLinks,
  ...personFetchLinks,
  ...organisationFetchLinks,
];

export const teamsFetchLinks: FetchLinks<TeamsDocument> = [
  'teams.title',
  'teams.subtitle',
  'teams.email',
  'teams.phone',
  'teams.url',
];

export const pageFormatsFetchLinks: FetchLinks<PageFormatsDocument> = [
  'page-formats.title',
  'page-formats.description',
];

export const placesFetchLinks: FetchLinks<PlacesDocument> = [
  'places.title',
  'places.geolocation',
  'places.level',
  'places.capacity',
  'places.locationInformation',
];

// Guards
export function isFilledLinkToPersonField(
  field: Contributor
): field is prismic.FilledContentRelationshipField<
  'people',
  'en-gb',
  InferDataInterface<PeopleDocument>
> & { data: PeopleDocument } {
  return isFilledLinkToDocumentWithData(field) && field.type === 'people';
}

export function isFilledLinkToOrganisationField(
  field: Contributor
): field is prismic.FilledContentRelationshipField<
  'organisations',
  'en-gb',
  InferDataInterface<OrganisationsDocument>
> & { data: OrganisationsDocument } {
  return (
    isFilledLinkToDocumentWithData(field) && field.type === 'organisations'
  );
}

export type MultiContentPrismicDocument =
  | PagesDocument
  | EventSeriesDocument
  | BooksDocument
  | EventsDocument
  | ArticlesDocument
  | ExhibitionsDocument
  | SeriesDocument
  | CardDocument
  | WebcomicsDocument;

export type StructuredSearchQuery = {
  types: string[];
  type: string[];
  ids: string[];
  id: string[];
  tags: string[];
  tag: string[];
  pageSize: number;
  orderings: string[];
  // content type specific
  'article-series': string[];
};

type Label = {
  title: prismic.RichTextField;
  description: prismic.RichTextField;
};

export type WithCardFormat = {
  format:
    | prismic.ContentRelationshipField<
        'article-formats',
        'en-gb',
        InferDataInterface<ArticleFormatsDocument>
      >
    | prismic.ContentRelationshipField<
        'event-formats',
        'en-gb',
        InferDataInterface<EventFormatsDocument>
      >
    | prismic.ContentRelationshipField<
        'labels',
        'en-gb',
        InferDataInterface<Label>
      >;
};

export type ExhibitionRelatedContentPrismicDocument =
  | ExhibitionsDocument
  | EventsDocument
  | ArticlesDocument
  | BooksDocument;

// TODO what are these for?
export type WithArticleFormat = {
  format: prismic.ContentRelationshipField<
    'article-formats',
    'en-gb',
    InferDataInterface<ArticleFormatsDocument>
  >;
};

export type WithGuideFormat = {
  format: prismic.ContentRelationshipField<
    'guide-formats',
    'en-gb',
    InferDataInterface<GuideFormatsDocument>
  >;
};

export type WithPageFormat = {
  format: prismic.ContentRelationshipField<
    'page-formats',
    'en-gb',
    InferDataInterface<PageFormatsDocument>
  >;
};

export type WithEventFormat = {
  format: prismic.ContentRelationshipField<
    'event-formats',
    'en-gb',
    InferDataInterface<EventFormatsDocument>
  >;
};
