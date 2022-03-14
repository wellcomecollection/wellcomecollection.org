import { EventSeries } from './event-series';
import { ArticleBasic } from './articles';
import { BookBasic } from './books';
import { EventBasic } from './events';
import { Exhibition } from './exhibitions';
import { Page } from './pages';
import { Series } from './series';
import { Guide } from './guides';
import { Weblink } from './weblinks';
import { Project } from './projects';

export type MultiContent =
  | Page
  | EventSeries
  | BookBasic
  | EventBasic
  | ArticleBasic
  | Exhibition
  | Series
  | Guide
  | Weblink
  | Project;
