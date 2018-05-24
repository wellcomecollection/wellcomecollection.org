// @flow
// If a type wants to be part of `MultiContent` it needs to have a `type` field
// to allow us to enumerate on it.
// TODO: Find a way to enforce ☝️
import type {Page} from './pages';
import type {EventSeries} from './event-series';
import type {Book} from './books';
export type MultiContent = | Page | EventSeries | Book;
