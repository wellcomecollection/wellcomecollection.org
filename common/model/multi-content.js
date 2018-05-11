// @flow
// If a type wants to be part of `MultiContent` it needs to have a `type` field
// to allow us to enumerate on it.
// TODO: Find a way to enforce ☝️
import type {Page} from './pages';
export type MultiContent = | Page;
