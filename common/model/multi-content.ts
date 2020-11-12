// If a type wants to be part of `MultiContent` it needs to have a `type` field
// to allow us to enumerate on it.
// TODO: Find a way to enforce ☝️
import { Page } from './pages';
import { EventSeries } from './event-series';
import { ArticleSeries } from './article-series';
import { Book } from './books';
import { UiEvent } from './events';
import { Article } from './articles';
import { ArticleScheduleItem } from './article-schedule-items';
import { UiExhibition } from './exhibitions';
import { Weblink } from './weblinks';

export type MultiContent =
  | Page
  | EventSeries
  | Book
  | UiEvent
  | Article
  | ArticleScheduleItem
  | UiExhibition
  | Weblink
  | ArticleSeries;
