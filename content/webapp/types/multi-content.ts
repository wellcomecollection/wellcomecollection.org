import { EventSeries } from '@weco/content/types/event-series';
import { ArticleBasic } from '@weco/content/types/articles';
import { BookBasic } from '@weco/content/types/books';
import { EventBasic } from '@weco/content/types/events';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { Page } from '@weco/content/types/pages';
import { Series, SeriesBasic } from '@weco/content/types/series';
import { Guide } from '@weco/content/types/guides';
import { Weblink } from '@weco/content/types/weblinks';
import { Project } from '@weco/content/types/projects';
import { Season } from '@weco/content/types/seasons';
import {
  ExhibitionGuide,
  ExhibitionGuideBasic,
} from '@weco/content/types/exhibition-guides';
import { Card } from '@weco/content/types/card';
import { VisualStoryBasic } from '@weco/content/types/visual-stories';

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
