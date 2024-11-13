import * as prismic from '@prismicio/client';

import {
  ContentListSlice as RawContentListSlice,
  EditorialImageSlice as RawEditorialImageSlice,
  EmbedSlice as RawEmbedSlice,
} from '@weco/common/prismicio-types';

import { ArticleBasic } from './articles';
import { Book } from './books';
import { Card } from './card';
import { EventSeries } from './event-series';
import { EventBasic } from './events';
import { ExhibitionBasic } from './exhibitions';
import { Guide } from './guides';
import { Page } from './pages';
import { Season } from './seasons';
import { Series, SeriesBasic } from './series';

export type Slice<TypeName extends string, Value> = {
  type: TypeName;
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
  return slice.slice_type === 'editorialImage';
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
