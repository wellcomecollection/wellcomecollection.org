import { Props as TableProps } from '@weco/common/views/components/Table/Table';
import { Props as ContactProps } from '@weco/common/views/components/Contact/Contact';
import { Props as IframeProps } from '@weco/common/views/components/Iframe/Iframe';
import { Props as InfoBlockProps } from '@weco/common/views/components/InfoBlock/InfoBlock';
import { Props as AsyncSearchResultsProps } from '../components/SearchResults/AsyncSearchResults';
import { Props as QuoteProps } from '../components/Quote/Quote';
import { Props as ImageGalleryProps } from '../components/ImageGallery/ImageGallery';
import { Props as DeprecatedImageListProps } from '../components/DeprecatedImageList/DeprecatedImageList';
import { Props as GifVideoProps } from '../components/GifVideo/GifVideo';
import { Props as TitledTextListProps } from '../components/TitledTextList/TitledTextList';
import { Props as TagsGroupProps } from '@weco/common/views/components/TagsGroup/TagsGroup';
import { Props as MapProps } from '../components/Map/Map';
import { Props as DiscussionProps } from '../components/Discussion/Discussion';
import { Props as EmbedProps } from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import { Props as MediaObjectListProps } from '../components/MediaObjectList/MediaObjectList';
import { AudioPlayerProps } from '@weco/common/views/components/AudioPlayer/AudioPlayer';
import * as prismicT from '@prismicio/types';
import { CaptionedImage } from '@weco/common/model/captioned-image';
import { Venue } from '@weco/common/model/opening-hours';
import { Page } from './pages';
import { EventSeries } from './event-series';
import { Book } from './books';
import { EventBasic } from './events';
import { Article } from './articles';
import { Exhibition } from './exhibitions';
import { Card } from './card';
import { Season } from './seasons';
import { Guide } from './guides';

export type Weight =
  | 'default'
  | 'featured'
  | 'standalone'
  | 'supporting'
  | 'frames';

type Slice<TypeName extends string, Value> = {
  type: TypeName;
  weight?: Weight;
  value: Value;
};

type ContentList = {
  title?: string;
  items: (
    | Page
    | EventSeries
    | Book
    | EventBasic
    | Article
    | Exhibition
    | Card
    | Season
    | Guide
  )[];
};

export function isContentList(
  slice: BodySlice
): slice is BodySlice & { type: 'contentList' } {
  return slice.type === 'contentList';
}

export function isVideoEmbed(
  slice: BodySlice
): slice is BodySlice & { type: 'videoEmbed' } {
  return slice.type === 'videoEmbed';
}

export function isPicture(
  slice: BodySlice
): slice is BodySlice & { type: 'picture' } {
  return slice.type === 'picture';
}

export function isStandfirst(
  slice: BodySlice
): slice is BodySlice & { type: 'standfirst' } {
  return slice.type === 'standfirst';
}

export type BodySlice =
  | Slice<'standfirst', prismicT.RichTextField>
  | Slice<'text', prismicT.RichTextField>
  | Slice<'map', MapProps>
  | Slice<'table', TableProps>
  | Slice<'mediaObjectList', MediaObjectListProps>
  | Slice<'contact', ContactProps>
  | Slice<'picture', CaptionedImage>
  | Slice<'imageGallery', ImageGalleryProps>
  | Slice<'deprecatedImageList', DeprecatedImageListProps>
  | Slice<'gifVideo', GifVideoProps>
  | Slice<'titledTextList', TitledTextListProps>
  | Slice<'discussion', DiscussionProps>
  | Slice<'infoBlock', InfoBlockProps>
  | Slice<'iframe', IframeProps>
  | Slice<'quote', QuoteProps>
  | Slice<'tagList', TagsGroupProps>
  | Slice<'searchResults', AsyncSearchResultsProps>
  | Slice<'collectionVenue', { content: Venue; showClosingTimes: boolean }>
  | Slice<'videoEmbed', EmbedProps>
  | Slice<'soundcloudEmbed', EmbedProps>
  | Slice<'contentList', ContentList>
  | Slice<'audioPlayer', AudioPlayerProps>;