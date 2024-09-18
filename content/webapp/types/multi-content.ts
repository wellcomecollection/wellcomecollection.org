import { ArticleBasic } from '@weco/content/types/articles';
import { BookBasic } from '@weco/content/types/books';
import { Card } from '@weco/content/types/card';
import { EventSeries } from '@weco/content/types/event-series';
import { EventBasic } from '@weco/content/types/events';
import {
  ExhibitionGuide,
  ExhibitionGuideBasic,
} from '@weco/content/types/exhibition-guides';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { Guide } from '@weco/content/types/guides';
import { Page } from '@weco/content/types/pages';
import { Project } from '@weco/content/types/projects';
import { Season } from '@weco/content/types/seasons';
import { Series, SeriesBasic } from '@weco/content/types/series';
import { VisualStoryBasic } from '@weco/content/types/visual-stories';
import { Weblink } from '@weco/content/types/weblinks';

export type MultiContent =
  | Page
  | EventSeries
  | BookBasic
  | EventBasic
  | ArticleBasic
  | ExhibitionBasic
  | Series
  | SeriesBasic
  | Guide
  | Weblink
  | Project
  | Season
  | ExhibitionGuide
  | ExhibitionGuideBasic
  | Card
  | VisualStoryBasic;
