// @flow
import { RichText } from 'prismic-dom';
// $FlowFixMe (tsx)
import { HTMLString } from './types';

export function asText(maybeContent: ?HTMLString): ?string {
  return maybeContent && RichText.asText(maybeContent).trim();
}
