import * as prismic from '@prismicio/client';
import { isUndefined } from '@weco/common/utils/type-guards';
import { Image } from '.';
import { InferDataInterface } from '@weco/common/services/prismic/types';
import { TeamPrismicDocument } from './teams';

export type TextSlice = prismic.Slice<'text', { text: prismic.RichTextField }>;

export type EditorialImageSlice = prismic.Slice<
  'editorialImage',
  { image: Image; caption: prismic.RichTextField }
>;

export type EditorialImageGallerySlice = prismic.Slice<
  'editorialImageGallery',
  { title: prismic.RichTextField },
  { image: Image; caption: prismic.RichTextField }
>;

export type GifVideoSlice = prismic.Slice<
  'gifVideo',
  {
    caption: prismic.RichTextField;
    tasl: prismic.KeyTextField;
    video: prismic.LinkToMediaField;
    playbackRate: prismic.SelectField<
      '0.1' | '0.25' | '0.5' | '0.75' | '1' | '1.25' | '1.5' | '1.75' | '2'
    >;
    autoPlay: prismic.BooleanField;
    loop: prismic.BooleanField;
    mute: prismic.BooleanField;
    showControls: prismic.BooleanField;
  }
>;

export type Iframe = prismic.Slice<
  'iframe',
  {
    iframeSrc: prismic.KeyTextField;
    // TODO: Why don't we use the Weco Image type?
    previewImage: prismic.ImageField;
  }
>;

type QuotePrimaryFields = {
  text: prismic.RichTextField;
  citation: prismic.RichTextField;
};

export type Quote = prismic.Slice<'quote', QuotePrimaryFields>;
export type QuoteV2 = prismic.Slice<'quoteV2', QuotePrimaryFields>;

export type Standfirst = prismic.Slice<
  'standfirst',
  {
    text: prismic.RichTextField;
  }
>;

export type Table = prismic.Slice<
  'table',
  {
    caption: prismic.KeyTextField;
    tableData: prismic.KeyTextField;
    hasRowHeaders: prismic.BooleanField;
  }
>;

export type Embed = prismic.Slice<
  'embed',
  {
    embed: prismic.EmbedField;
    caption: prismic.RichTextField;
  }
>;

export type Map = prismic.Slice<
  'map',
  {
    title: prismic.KeyTextField;
    geolocation: prismic.GeoPointField;
  }
>;

export type CollectionVenue = prismic.Slice<
  'collectionVenue',
  {
    content: prismic.ContentRelationshipField<'collection-venue'>;
    showClosingTimes: prismic.SelectField<'yes'>;
  }
>;

export type Contact = prismic.Slice<
  'contact',
  {
    content: prismic.ContentRelationshipField<
      'teams',
      'en-us',
      InferDataInterface<Partial<TeamPrismicDocument>>
    >;
  }
>;

export type Discussion = prismic.Slice<
  'discussion',
  {
    title: prismic.RichTextField;
    text: prismic.RichTextField;
  }
>;

export type TagList = prismic.Slice<
  'tagList',
  {
    title: prismic.RichTextField;
  },
  {
    link: prismic.LinkField;
    linkText: prismic.KeyTextField;
  }
>;

export type AudioPlayer = prismic.Slice<
  'audioPlayer',
  {
    title: prismic.RichTextField;
    audio: prismic.LinkToMediaField;
  }
>;

export type InfoBlock = prismic.Slice<
  'infoBlock',
  {
    title: prismic.RichTextField;
    text: prismic.RichTextField;
    link: prismic.LinkField;
    linkText: prismic.KeyTextField;
  }
>;

export type TitledTextList = prismic.Slice<
  'titledTextList',
  Record<string, never>,
  {
    title: prismic.RichTextField;
    text: prismic.RichTextField;
    link: prismic.LinkField;
    label: prismic.ContentRelationshipField<'labels'>;
  }
>;

export type ContentList = prismic.Slice<
  'contentList',
  { title: prismic.RichTextField },
  {
    content: prismic.ContentRelationshipField<
      | 'pages'
      | 'event-series'
      | 'books'
      | 'events'
      | 'articles'
      | 'exhibitions'
      | 'card'
      | 'seasons'
      | 'landing-pages'
      | 'guides'
    >;
  }
>;

export type SearchResults = prismic.Slice<
  'searchResults',
  { title: prismic.RichTextField; query: prismic.KeyTextField }
>;

export type DeprecatedImageList = prismic.Slice<
  'imageList',
  Record<string, never>,
  {
    title: prismic.RichTextField;
    subtitle: prismic.RichTextField;
    description: prismic.RichTextField;
    image: Image;
  }
>;

export type MediaObjectList = prismic.Slice<
  'mediaObjectList',
  Record<string, never>,
  { title: prismic.RichTextField; text: prismic.RichTextField; image: Image }
>;

export type SliceTypes =
  | TextSlice
  | EditorialImageSlice
  | EditorialImageGallerySlice
  | GifVideoSlice
  | Iframe
  | Quote
  | QuoteV2
  | Standfirst
  | Table
  | Embed
  | Map
  | CollectionVenue
  | Contact
  | Discussion
  | TagList
  | InfoBlock
  | TitledTextList
  | ContentList
  | SearchResults
  | MediaObjectList
  | DeprecatedImageList;

export type Body = prismic.SliceZone<SliceTypes>;

// This generates a map of { [key: SliceKey]: SliceType }
type SliceMap = {
  [S in SliceTypes as S extends prismic.Slice<infer X> ? X : never]: S;
};

export function isSliceType<SliceType extends keyof SliceMap>(
  type: SliceType,
  label?: string
) {
  return (slice: SliceTypes): slice is SliceMap[typeof type] => {
    return (
      slice.slice_type === type &&
      (isUndefined(label) || slice.slice_label === label)
    );
  };
}
