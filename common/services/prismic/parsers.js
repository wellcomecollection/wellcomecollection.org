// @flow
import { RichText } from 'prismic-dom';
// $FlowFixMe (tsx)
import { HTMLString, PrismicFragment } from './types';
import flattenDeep from 'lodash.flattendeep';
import type { Link } from '../../model/link';
import type {
  BackgroundTexture,
  PrismicBackgroundTexture,
} from '../../model/background-texture';
import type { LabelField } from '../../model/label-field';
import { dasherize } from '../../utils/grammar';

export function asText(maybeContent: ?HTMLString): ?string {
  return maybeContent && RichText.asText(maybeContent).trim();
}

export function parseTitle(title: HTMLString): string {
  // We always need a title - blunt validation, but validation none the less
  return asText(title) || '';
}

export function parseBackgroundTexture(
  backgroundTexture: PrismicBackgroundTexture
): BackgroundTexture {
return {
    image: backgroundTexture.image.url,
    name: backgroundTexture.name,
  };
}

export function parseLabelType(fragment: PrismicFragment): LabelField {
  return {
    id: fragment.id,
    title: fragment.data && asText(fragment.data.title),
    description: fragment.data && fragment.data.description,
  };
}

export function parseSingleLevelGroup(
  frag: PrismicFragment[],
  singlePropertyName: string
) {
  return (
    (frag || [])
      .filter(fragItem => isDocumentLink(fragItem[singlePropertyName]))
      /*eslint-disable */
      .map<PrismicFragment>(fragItem => fragItem[singlePropertyName])
  );
  /* eslint-enable */
}

// If a link is non-existant, it can either be returned as `null`, or as an
// empty link object, which is why we use this
export function isDocumentLink(fragment: ?PrismicFragment): boolean {
  return Boolean(fragment && fragment.isBroken === false && fragment.data);
}

export function parseOnThisPage(fragment: PrismicFragment[]): Link[] {
  return flattenDeep(
    fragment.map(slice => slice.primary.title || slice.primary.text || [])
  )
    .filter(text => text.type === 'heading2')
    .map(item => {
      return {
        text: item.text,
        url: `#${dasherize(item.text)}`,
      };
    });
}
