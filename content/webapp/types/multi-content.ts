import { EventSeries } from './event-series';
import { ArticleBasic } from './articles';
import { BookBasic } from './books';
import { EventBasic } from './events';
import { ExhibitionBasic } from './exhibitions';
import { Page } from './pages';
import { Series } from './series';
import { Guide } from './guides';
import { Weblink } from './weblinks';
import { Project } from './projects';
import { Season } from './seasons';
import { ExhibitionGuide, ExhibitionGuideBasic } from './exhibition-guides';

export type MultiContent =
  | Page
  | EventSeries
  | BookBasic
  | EventBasic
  | ArticleBasic
  | ExhibitionBasic
  | Series
  | Guide
  | Weblink
  | Project
  | Season
  | ExhibitionGuide
  | ExhibitionGuideBasic;
