import { EventSeries } from './event-series';
import { Article } from './articles';
import { Book } from './books';
import { Event } from './events';
import { Exhibition } from './exhibitions';
import { Page } from './pages';
import { Series } from './series';
import { Guide } from './guides';
import { Weblink } from './weblinks';
import { Project } from './projects';
import { ArticleScheduleItem } from './article-schedule-items';
import { Card } from './card';
import { Season } from './seasons';

export type MultiContent =
  | ArticleScheduleItem
  | Card
  | Page
  | EventSeries
  | Book
  | Event
  | Article
  | Exhibition
  | Season
  | Series
  | Guide
  | Weblink
  | Project;
