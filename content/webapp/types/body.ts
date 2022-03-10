import * as prismicT from '@prismicio/types';
import { Props as TableProps } from '@weco/common/views/components/Table/Table';
import { Props as ContactProps } from '@weco/common/views/components/Contact/Contact';
import { Props as IframeProps } from '@weco/common/views/components/Iframe/Iframe';
import { Props as InfoBlockProps } from '@weco/common/views/components/InfoBlock/InfoBlock';
import { Props as QuoteProps } from '../components/Quote/Quote';
import { Props as ImageGalleryProps } from '../components/ImageGallery/ImageGallery';
import { Props as DeprecatedImageListProps } from '../components/DeprecatedImageList/DeprecatedImageList';
import { Props as GifVideoProps } from '../components/GifVideo/GifVideo';
import { Props as TitledTextListProps } from '../components/TitledTextList/TitledTextList';
import { Props as MapProps } from '../components/Map/Map';
import { Props as DiscussionProps } from '../components/Discussion/Discussion';
import { Props as SearchResultsProps } from '../components/SearchResults/AsyncSearchResults';
import { Props as ContentListProps } from '../components/SearchResults/SearchResults';
import { Props as TagsGroupProps } from '../components/TagsGroup/TagsGroup';
import { Props as EmbedProps } from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import { MediaObjectType } from './media-object';
import { CaptionedImage } from '@weco/common/model/captioned-image';
import { Venue } from '@weco/common/model/opening-hours';
import { Page } from './pages';
import { EventSeries } from './event-series';
import { Book } from './books';
import { Article } from './articles';
import { Exhibition } from './exhibitions';
import { Card } from './card';
import { Season } from './seasons';
import { Guide } from './guides';

export type Weight = 'default' | 'featured' | 'standalone' | 'supporting';

type BodySlice<TypeName extends string, Value> = {
  type: TypeName;
  weight?: Weight;
  // TODO: Sync up types with the body slices and the components they return
  value: Value;
};

export type text = BodySlice<'text', prismicT.RichTextField>;
export type picture = BodySlice<'picture', CaptionedImage>;
export type imageGallery = BodySlice<'imageGallery', ImageGalleryProps>;
export type gifVideo = BodySlice<'gifVideo', GifVideoProps>;
export type iframe = BodySlice<'iframe', IframeProps>;
export type quote = BodySlice<'quote', QuoteProps>;
export type standfirst = BodySlice<'standfirst', prismicT.RichTextField>;
export type table = BodySlice<'table', TableProps>;
export type videoEmbed = BodySlice<'videoEmbed', EmbedProps>;
export type soundcloudEmbed = BodySlice<'soundcloudEmbed', EmbedProps>;
export type map = BodySlice<'map', MapProps>;
export type collectionVenue = BodySlice<
  'collectionVenue',
  { content: Venue; showClosingTimes: boolean }
>;
export type contact = BodySlice<'contact', ContactProps>;
export type discussion = BodySlice<'discussion', DiscussionProps>;
export type tagList = BodySlice<'tagList', TagsGroupProps>;
export type infoBlock = BodySlice<'infoBlock', InfoBlockProps>;
export type titledTextList = BodySlice<'titledTextList', TitledTextListProps>;
export type contentList = BodySlice<
  'contentList',
  ContentListProps & {
    items: (
      | Page
      | EventSeries
      | Book
      | Event
      | Article
      | Exhibition
      | Card
      | Season
      | Guide
    )[];
  }
>;
export type searchResults = BodySlice<'searchResults', SearchResultsProps>;
export type mediaObjectList = BodySlice<
  'mediaObjectList',
  { items: MediaObjectType[] }
>;
export type deprecatedImageList = BodySlice<
  'deprecatedImageList',
  DeprecatedImageListProps
>;

export type BodySliceType =
  | text
  | picture
  | imageGallery
  | gifVideo
  | iframe
  | quote
  | standfirst
  | table
  | videoEmbed
  | soundcloudEmbed
  | map
  | collectionVenue
  | contact
  | discussion
  | tagList
  | infoBlock
  | titledTextList
  | contentList
  | searchResults
  | mediaObjectList
  | deprecatedImageList;

export type BodyType = BodySliceType[];
