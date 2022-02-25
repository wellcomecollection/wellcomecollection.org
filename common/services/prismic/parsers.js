// @flow
import { RichText } from 'prismic-dom';
// $FlowFixMe (tsx)
import { HTMLString } from './types';

export function asText(maybeContent: ?HTMLString): ?string {
  return maybeContent && RichText.asText(maybeContent).trim();
}

export function parseTitle(title: HTMLString): string {
  // We always need a title - blunt validation, but validation none the less
  return asText(title) || '';
}
