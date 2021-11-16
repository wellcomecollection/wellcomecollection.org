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
  RelationField,
} from '@prismicio/types';
import { Image } from './image';

type TextSlice = Slice<'slice', { text: RichTextField }>;

type EditorialImageSlice = Slice<
  'editorialImage',
  { image: Image; caption: RichTextField }
>;

type EditorialImageGallerySlice = Slice<
  'editorialImageGallery',
  { title: RichTextField },
  { image: Image; caption: RichTextField }
>;

type GifVideoSlice = Slice<
  'gifVideo',
  {
    caption: RichTextField;
    tasl: KeyTextField;
    video: LinkToMediaField;
    playbackRate: SelectField<
      '0.1' | '0.25' | '0.5' | '0.75' | '1' | '1.25' | '1.5' | '1.75' | '2'
    >;
    autoplay: BooleanField;
    loop: BooleanField;
    mute: BooleanField;
    showControls: BooleanField;
  }
>;

type Iframe = Slice<
  'iframe',
  {
    iframeSrc: KeyTextField;
    // TODO: Why don't we use the Weco Image type?
    previewImage: ImageField;
  }
>;

type Quote = Slice<
  'quote',
  {
    text: RichTextField;
    citation: RichTextField;
  }
>;

type Standfirst = Slice<
  'standfirst',
  {
    text: RichTextField;
  }
>;

type Table = Slice<
  'table',
  {
    caption: KeyTextField;
    tableData: KeyTextField;
    hasRowHeaders: BooleanField;
  }
>;

type Embed = Slice<
  'embed',
  {
    embed: EmbedField;
    caption: KeyTextField;
  }
>;

type Map = Slice<
  'map',
  {
    title: KeyTextField;
    geolocation: GeoPointField;
  }
>;

type CollectionVenue = Slice<
  'collectionVenue',
  {
    content: RelationField<'collection-venue'>;
    showClosingTimes: SelectField<'yes'>;
  }
>;

type Contact = Slice<
  'contact',
  {
    content: RelationField<'teams'>;
  }
>;

type Discussion = Slice<
  'discussion',
  {
    title: RichTextField;
    text: RichTextField;
  }
>;

type TagList = Slice<
  'tagList',
  {
    title: RichTextField;
  },
  {
    link: LinkField;
    linkText: KeyTextField;
  }
>;

type InfoBlock = Slice<
  'infoBlock',
  {
    title: RichTextField;
    text: RichTextField;
    link: LinkField;
    linkText: KeyTextField;
  }
>;

type TitledTextList = Slice<
  'titledTextList',
  Record<string, never>,
  {
    title: RichTextField;
    text: RichTextField;
    link: LinkField;
    label: RelationField<'labels'>;
  }
>;

type ContentList = Slice<
  'contentList',
  { title: RichTextField },
  {
    content: RelationField<
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

type SearchResults = Slice<
  'contentList',
  { title: RichTextField; query: KeyTextField }
>;

type MediaObjectList = Slice<
  'contentList',
  Record<string, never>,
  { title: RichTextField; text: RichTextField; image: Image }
>;

export type Body = SliceZone<
  | TextSlice
  | EditorialImageSlice
  | EditorialImageGallerySlice
  | GifVideoSlice
  | Iframe
  | Quote
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
>;
