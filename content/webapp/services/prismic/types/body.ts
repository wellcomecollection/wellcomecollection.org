import * as prismic from '@prismicio/client';
import { Image } from '.';
import { InferDataInterface } from '@weco/common/services/prismic/types';
import { TeamPrismicDocument } from './teams';
// TODO delete this file once we've moved to SliceZone
export type TextSlice = prismic.Slice<'text', { text: prismic.RichTextField }>;

export type TextAndImageSlice = prismic.Slice<
  'textAndImage',
  {
    text: prismic.RichTextField;
    image: prismic.ImageField;
    isZoomable: prismic.BooleanField;
  }
>;

export type TextAndIconsSlice = prismic.Slice<
  'textAndIcons',
  { text: prismic.RichTextField },
  { icon: prismic.ImageField }
>;

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

// Quote used to be the one we offered - it still exists in 189 instances
// We now offer QuoteV2 instead, which has the same fields.
// They both use the same renderer - we just need to still support legacy Quote
// TODO: One day, manually move them all over to use QuoteV2 and clear out any
//       old reference to Quote. Ideally rename QuoteV2 to Quote.
//       The best way to do this is up for debate:
//       https://github.com/wellcomecollection/wellcomecollection.org/pull/9979#issuecomment-1602448601
export type Quote = prismic.Slice<'quote', QuotePrimaryFields>;
export type QuoteV2 = prismic.Slice<'quoteV2', QuotePrimaryFields>;

export type Standfirst = prismic.Slice<
  'standfirst',
  {
    text: prismic.RichTextField;
  }
>;

export type Embed = prismic.Slice<
  'embed',
  {
    embed: prismic.EmbedField;
    caption: prismic.RichTextField;
    transcript: prismic.RichTextField;
  }
>;

export type Map = prismic.Slice<
  'map',
  {
    title: prismic.RichTextField;
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
    transcript: prismic.RichTextField;
  }
>;

export type InfoBlock = prismic.Slice<
  'infoBlock',
  {
    title: prismic.RichTextField;
    text: prismic.RichTextField;
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

export type SliceTypes =
  | TextSlice
  | EditorialImageSlice
  | EditorialImageGallerySlice
  | GifVideoSlice
  | Iframe
  | Quote
  | QuoteV2
  | Standfirst
  | Embed
  | Map
  | CollectionVenue
  | Contact
  | TagList
  | InfoBlock
  | TitledTextList
  | ContentList
  | SearchResults;

export type Body = prismic.SliceZone<SliceTypes>;
