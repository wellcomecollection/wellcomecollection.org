import {
  FilledImageFieldImage,
  KeyTextField,
  RichTextField,
  Slice,
  SliceZone,
  PrismicDocument,
  GroupField,
  ContentRelationshipField,
  FilledContentRelationshipField,
  NumberField,
  EmptyLinkField,
} from '@prismicio/client';
import { ArticleFormat } from './article-format';
import { ExhibitionFormat } from './exhibition-format';
import { ProjectFormat } from './project-format';
import { Body } from './body';
import { EditorialContributorRole, Organisation, Person } from './contributors';
import { EventSeriesPrismicDocument } from './event-series';
import { ExhibitionPrismicDocument } from './exhibitions';
import { SeasonPrismicDocument } from './seasons';
import {
  isFilledLinkToDocumentWithData,
  InferDataInterface,
} from '@weco/common/services/prismic/types';

export type InferCustomType<T> = T extends PrismicDocument<
  any,
  infer CustomType
>
  ? CustomType
  : never;

/** This gives us type checking on fetch links.  e.g. if you have a type
 *
 *      type ShapePrismicDocument = { sides: NumberField, colour: KeyTextField };
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
export type FetchLinks<T extends PrismicDocument> = {
  [D in keyof InferDataInterface<T>]: D extends string
    ? `${InferCustomType<T>}.${D}`
    : never;
}[keyof InferDataInterface<T>][];

type Dimension = {
  width: number;
  height: number;
};

// Currently the Prismic types only allow you to specify 1 image
type ThumbnailedImageField<Thumbnails extends Record<string, Dimension>> =
  FilledImageFieldImage & {
    [Property in keyof Thumbnails]?: FilledImageFieldImage;
  };

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

type Promo = { caption: RichTextField; image: Image; link: KeyTextField };
export type PromoSliceZone = SliceZone<Slice<'editorialImage', Promo>>;

export type CommonPrismicFields = {
  title: RichTextField;
  body: Body;
  promo: PromoSliceZone;
  metadataDescription: KeyTextField;
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
  series: GroupField<{
    series: ContentRelationshipField<
      'series',
      'en-gb',
      InferDataInterface<EventSeriesPrismicDocument>
    >;
  }>;
};
export const eventSeriesFetchLinks: FetchLinks<EventSeriesPrismicDocument> = [
  'event-series.title',
  'event-series.backgroundTexture',
  'event-series.promo',
];

export type WithSeasons = {
  seasons: GroupField<{
    season: ContentRelationshipField<
      'seasons',
      'en-gb',
      InferDataInterface<SeasonPrismicDocument>
    >;
  }>;
};
export const seasonsFetchLinks: FetchLinks<SeasonPrismicDocument> = [
  'seasons.title',
  'seasons.start',
  'seasons.end',
  'seasons.promo',
];

export type WithArticleFormat = {
  format: ContentRelationshipField<
    'article-formats',
    'en-gb',
    InferDataInterface<ArticleFormat>
  >;
};
export const articleFormatsFetchLinks: FetchLinks<ArticleFormat> = [
  'article-formats.title',
  'article-formats.description',
];

export const exhibitionFormatsFetchLinks: FetchLinks<ExhibitionFormat> = [
  'exhibition-formats.title',
];

export const projectFormatsFetchLinks: FetchLinks<ProjectFormat> = [
  'project-formats.title',
];

export type WithExhibitionParents = {
  parents: GroupField<{
    order: NumberField;
    parent: ContentRelationshipField<
      'exhibitions',
      // We know this is an ExhibitionPrismicDocument, but the type checker gets
      // unhappy about the circular reference:
      //
      //    'event' is referenced directly or indirectly in its own type annotation.
      //
      // TODO: Find a better way to do this which doesn't upset the type checker.
      InferDataInterface<any>
    >;
  }>;
};
export const exhibitionsFetchLinks: FetchLinks<ExhibitionPrismicDocument> = [
  'exhibitions.title',
  'exhibitions.promo',
  'exhibitions.shortTitle',
  'exhibitions.format',
];

type Contributor =
  | EmptyLinkField<'Document'>
  | FilledContentRelationshipField<'people', 'en-gb', InferDataInterface<Person>>
  | FilledContentRelationshipField<
      'organisations',
      'en-gb',
      InferDataInterface<Organisation>
    >;

export type WithContributors = {
  contributorsTitle: RichTextField;
  contributors: GroupField<{
    role: ContentRelationshipField<
      'editorial-contributor-roles',
      'en-gb',
      InferDataInterface<EditorialContributorRole>
    >;
    contributor: Contributor;
    description: RichTextField;
  }>;
};

const contributionRoleFetchLinks: FetchLinks<EditorialContributorRole> = [
  'editorial-contributor-roles.title',
  'editorial-contributor-roles.describedBy',
];

const personFetchLinks: FetchLinks<Person> = [
  'people.name',
  'people.description',
  'people.pronouns',
  'people.image',
  'people.sameAs',
];

const organisationFetchLinks: FetchLinks<Organisation> = [
  'organisations.name',
  'organisations.description',
  'organisations.image',
  'organisations.sameAs',
];

export const contributorFetchLinks = [
  ...contributionRoleFetchLinks,
  ...personFetchLinks,
  ...organisationFetchLinks,
];

// Guards
export function isFilledLinkToPersonField(
  field: Contributor
): field is FilledContentRelationshipField<
  'people',
  'en-gb',
  InferDataInterface<Person>
> & { data: Person } {
  return isFilledLinkToDocumentWithData(field) && field.type === 'people';
}

export function isFilledLinkToOrganisationField(
  field: Contributor
): field is FilledContentRelationshipField<
  'organisations',
  'en-gb',
  InferDataInterface<Organisation>
> & { data: Organisation } {
  return (
    isFilledLinkToDocumentWithData(field) && field.type === 'organisations'
  );
}
