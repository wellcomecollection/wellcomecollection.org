// @flow
import { RichText } from 'prismic-dom';
// $FlowFixMe (tsx)
import { HTMLString, PrismicFragment } from './types';
import type { LabelField } from '../../model/label-field';

export function asText(maybeContent: ?HTMLString): ?string {
  return maybeContent && RichText.asText(maybeContent).trim();
}

export function parseTitle(title: HTMLString): string {
  // We always need a title - blunt validation, but validation none the less
  return asText(title) || '';
}

export function parseLabelType(fragment: PrismicFragment): LabelField {
  return {
    id: fragment.id,
    title: fragment.data && asText(fragment.data.title),
    description: fragment.data && fragment.data.description,
  };
}
