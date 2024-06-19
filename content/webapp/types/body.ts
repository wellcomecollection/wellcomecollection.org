import {
  ContentListSlice as RawContentListSlice,
  EditorialImageSlice as RawEditorialImageSlice,
  EmbedSlice as RawEmbedSlice,
} from '@weco/common/prismicio-types';

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

export function isContentList(
  slice: prismic.Slice
): slice is RawContentListSlice {
  return slice.slice_type === 'contentList';
}

export function isVideoEmbed(slice: prismic.Slice): slice is RawEmbedSlice {
  return slice.primary.provider_name === 'youtube';
}

export function isEditorialImage(
  slice: prismic.Slice
): slice is RawEditorialImageSlice {
  return slice.slice_type === 'picture';
}

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
