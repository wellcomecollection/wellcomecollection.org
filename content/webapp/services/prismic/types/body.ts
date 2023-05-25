import {
  SliceZone,
  Slice,
  RichTextField,
  KeyTextField,
  LinkToMediaField,
  LinkField,
  SelectField,
  BooleanField,
  ImageField,
  GeoPointField,
  EmbedField,
  ContentRelationshipField,
} from '@prismicio/client';
import { isUndefined } from '@weco/common/utils/type-guards';
import { Image } from '.';
import { InferDataInterface } from '@weco/common/services/prismic/types';
import { TeamPrismicDocument } from './teams';

export type TextSlice = Slice<'text', { text: RichTextField }>;

export type EditorialImageSlice = Slice<
  'editorialImage',
  { image: Image; caption: RichTextField }
>;

export type EditorialImageGallerySlice = Slice<
  'editorialImageGallery',
  { title: RichTextField },
  { image: Image; caption: RichTextField }
>;

export type GifVideoSlice = Slice<
  'gifVideo',
  {
    caption: RichTextField;
    tasl: KeyTextField;
    video: LinkToMediaField;
    playbackRate: SelectField<
      '0.1' | '0.25' | '0.5' | '0.75' | '1' | '1.25' | '1.5' | '1.75' | '2'
    >;
    autoPlay: BooleanField;
    loop: BooleanField;
    mute: BooleanField;
    showControls: BooleanField;
  }
>;

export type Iframe = Slice<
  'iframe',
  {
    iframeSrc: KeyTextField;
    // TODO: Why don't we use the Weco Image type?
    previewImage: ImageField;
  }
>;

type QuotePrimaryFields = {
  text: RichTextField;
  citation: RichTextField;
};

export type Quote = Slice<'quote', QuotePrimaryFields>;
export type QuoteV2 = Slice<'quoteV2', QuotePrimaryFields>;

export type Standfirst = Slice<
  'standfirst',
  {
    text: RichTextField;
  }
>;

export type Table = Slice<
  'table',
  {
    caption: KeyTextField;
    tableData: KeyTextField;
    hasRowHeaders: BooleanField;
  }
>;

export type Embed = Slice<
  'embed',
  {
    embed: EmbedField;
    caption: RichTextField;
  }
>;

export type Map = Slice<
  'map',
  {
    title: KeyTextField;
    geolocation: GeoPointField;
  }
>;

export type CollectionVenue = Slice<
  'collectionVenue',
  {
    content: ContentRelationshipField<'collection-venue'>;
    showClosingTimes: SelectField<'yes'>;
  }
>;

export type Contact = Slice<
  'contact',
  {
    content: ContentRelationshipField<
      'teams',
      'en-us',
      InferDataInterface<Partial<TeamPrismicDocument>>
    >;
  }
>;

export type Discussion = Slice<
  'discussion',
  {
    title: RichTextField;
    text: RichTextField;
  }
>;

export type TagList = Slice<
  'tagList',
  {
    title: RichTextField;
  },
  {
    link: LinkField;
    linkText: KeyTextField;
  }
>;

export type AudioPlayer = Slice<
  'audioPlayer',
  {
    title: RichTextField;
    audio: LinkToMediaField;
  }
>;

export type InfoBlock = Slice<
  'infoBlock',
  {
    title: RichTextField;
    text: RichTextField;
    link: LinkField;
    linkText: KeyTextField;
  }
>;

export type TitledTextList = Slice<
  'titledTextList',
  Record<string, never>,
  {
    title: RichTextField;
    text: RichTextField;
    link: LinkField;
    label: ContentRelationshipField<'labels'>;
  }
>;

export type ContentList = Slice<
  'contentList',
  { title: RichTextField },
  {
    content: ContentRelationshipField<
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

export type SearchResults = Slice<
  'searchResults',
  { title: RichTextField; query: KeyTextField }
>;

export type DeprecatedImageList = Slice<
  'imageList',
  Record<string, never>,
  {
    title: RichTextField;
    subtitle: RichTextField;
    description: RichTextField;
    image: Image;
  }
>;

export type MediaObjectList = Slice<
  'mediaObjectList',
  Record<string, never>,
  { title: RichTextField; text: RichTextField; image: Image }
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

export type Body = SliceZone<SliceTypes>;

// This generates a map of { [key: SliceKey]: SliceType }
type SliceMap = {
  [S in SliceTypes as S extends Slice<infer X> ? X : never]: S;
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
