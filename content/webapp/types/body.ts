import {
  ContentListSlice,
  EditorialImageSlice,
  EmbedSlice,
  StandfirstSlice,
} from '@weco/common/prismicio-types';
import { Props as ContactProps } from '@weco/content/components/Contact/Contact';
import { Props as IframeProps } from '@weco/common/views/components/Iframe/Iframe';
import { Props as InfoBlockProps } from '@weco/content/components/InfoBlock/InfoBlock';
import { Props as AsyncSearchResultsProps } from '../components/SearchResults/AsyncSearchResults';
import { Props as QuoteProps } from '../components/Quote/Quote';
import { Props as ImageGalleryProps } from '../components/ImageGallery';
import { Props as GifVideoProps } from '../components/GifVideo/GifVideo';
import { Props as TitledTextListProps } from '../components/TitledTextList/TitledTextList';
import { Props as TagsGroupProps } from '@weco/content/components/TagsGroup/TagsGroup';
import { Props as MapProps } from '../components/Map/Map';
import { Props as EmbedProps } from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import {
  TextAndIconsItem,
  TextAndImageItem,
} from '../components/TextAndImageOrIcons';
import { AudioPlayerProps } from '@weco/content/components/AudioPlayer/AudioPlayer';

import { ArticleBasic } from './articles';
import { Book } from './books';
import { EventBasic } from './events';
import { EventSeries } from './event-series';
import { ExhibitionBasic } from './exhibitions';
import { Page } from './pages';
import { Series, SeriesBasic } from './series';
import { Guide } from './guides';
import { Season } from './seasons';
import { Card } from './card';

import * as prismic from '@prismicio/client';
import { CaptionedImage } from '@weco/common/model/captioned-image';
import { Venue } from '@weco/common/model/opening-hours';

export type Weight =
  | 'default'
  | 'featured'
  | 'standalone'
  | 'supporting'
  | 'frames';

export type Slice<TypeName extends string, Value> = {
  type: TypeName;
  weight?: Weight;
  value: Value;
};

export function isContentList(slice: prismic.Slice): slice is ContentListSlice {
  return slice.slice_type === 'contentList';
}

export function isVideoEmbed(slice: prismic.Slice): slice is EmbedSlice {
  return slice.primary.provider_name === 'youtube';
}

export function isEditorialImage(
  slice: prismic.Slice
): slice is EditorialImageSlice {
  return slice.slice_type === 'picture';
}

// export function isStandfirst(slice: prismic.Slice): slice is StandfirstSlice {
//   return slice.slice_type === 'standfirst';
// } // TODO is this used?

export type ContentListItems =
  | Page
  | EventSeries
  | Book
  | EventBasic
  | ArticleBasic
  | ExhibitionBasic
  | Series
  | SeriesBasic
  | Guide
  | Season;

export type ContentListProps = {
  title?: string | undefined;
  summary?: string | undefined;
  items: (ContentListItems | Card)[];
  showPosition?: boolean | undefined;
};
