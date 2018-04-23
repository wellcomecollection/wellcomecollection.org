// @flow
// If a type wants to be part of `MultiContent` it needs to have a `type` field
// to allow us to enumerate on it.
// TODO: Find a way to enforce ☝️
import type {InfoPage} from './info-pages';
export type MultiContent = | InfoPage;
