import {
  ContentListSlice as RawContentListSlice,
  EditorialImageSlice as RawEditorialImageSlice,
  EmbedSlice as RawEmbedSlice,
  FullWidthBannerSlice as RawFullWidthBannerSlice,
} from '@weco/common/prismicio-types';

import { ArticleBasic } from './articles';
import { Book } from './books';
import { Card } from './card';
import { EventSeries } from './event-series';
import { EventBasic } from './events';
import { ExhibitionBasic } from './exhibitions';
import { PrismicBodySlice } from './generic-content-fields';
import { Guide } from './guides';
import { Page } from './pages';
import { Season } from './seasons';

export type Slice<TypeName extends string, Value> = {
  type: TypeName;
  value: Value;
};

// These predicates accept PrismicBodySlice so they work on any untransformedBody array.
export function isContentList(
  slice: PrismicBodySlice | undefined
): slice is RawContentListSlice {
  return !!slice && slice.slice_type === 'contentList';
}

export function isFullWidthBanner(
  slice: PrismicBodySlice | undefined
): slice is RawFullWidthBannerSlice {
  return !!slice && slice.slice_type === 'fullWidthBanner';
}

export function isVideoEmbed(
  slice: PrismicBodySlice | undefined
): slice is RawEmbedSlice {
  if (!slice || slice.slice_type !== 'embed') return false;
  // PrismicBodySlice doesn't carry `primary`, so widen via `unknown` to access it.
  const primary = (slice as unknown as { primary: Record<string, unknown> })
    .primary;
  return 'provider_name' in primary && primary.provider_name === 'youtube';
}

export function isEditorialImage(
  slice: PrismicBodySlice | undefined
): slice is RawEditorialImageSlice {
  return !!slice && slice.slice_type === 'editorialImage';
}

export type ContentListItems =
  | Page
  | EventSeries
  | Book
  | EventBasic
  | ArticleBasic
  | ExhibitionBasic
  | Guide
  | Season;

export type ContentListProps = {
  title?: string | undefined;
  summary?: string | undefined;
  items: (ContentListItems | Card)[];
  showPosition?: boolean | undefined;
};
