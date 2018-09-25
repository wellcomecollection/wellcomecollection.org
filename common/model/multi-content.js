// @flow
// If a type wants to be part of `MultiContent` it needs to have a `type` field
// to allow us to enumerate on it.
// TODO: Find a way to enforce ☝️
import type {Page} from './pages';
import type {EventSeries} from './event-series';
import type {Book} from './books';
import type {UiEvent} from './events';
import type {Installation} from './installations';
import type {Article} from './articles';
import type {ArticleScheduleItem} from './article-schedule-items';

export type MultiContent =
  | Page
  | EventSeries
  | Book
  | UiEvent
  | Article
  | Installation
  | ArticleScheduleItem;
