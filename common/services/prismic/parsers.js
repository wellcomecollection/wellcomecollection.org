// @flow
import { RichText, Date as PrismicDate } from 'prismic-dom';
// $FlowFixMe (tsx)
import { PrismicLink, HTMLString, PrismicFragment } from './types';
import flattenDeep from 'lodash.flattendeep';
import type { Tasl } from '../../model/tasl';
import type { LicenseType } from '../../model/license';
import type { Format } from '../../model/format';
import type { Link } from '../../model/link';
import type {
  BackgroundTexture,
  PrismicBackgroundTexture,
} from '../../model/background-texture';
import type { LabelField } from '../../model/label-field';
import { licenseTypeArray } from '../../model/license';
import { dasherize } from '../../utils/grammar';
import linkResolver from './link-resolver';
import type { HTMLSerializer } from 'prismic-reactjs';
import type { Element } from 'react';

export function isEmptyHtmlString(maybeContent: ?HTMLString): boolean {
  return maybeContent ? asHtml(maybeContent) === null : false;
}

export function asText(maybeContent: ?HTMLString): ?string {
  return maybeContent && RichText.asText(maybeContent).trim();
}

export function asHtml(
  maybeContent: ?HTMLString,
  htmlSerializer?: HTMLSerializer<Element<any>>
) {
  // Prismic can send us empty html elements which can lead to unwanted UI in templates.
  // Check that `asText` wouldn't return an empty string.
  const isEmpty = !maybeContent || (asText(maybeContent) || '').trim() === '';
  return isEmpty
    ? null
    : RichText.asHtml(maybeContent, linkResolver, htmlSerializer).trim();
}

function isMissingOrEmpty(maybeContent: any) {
  // Prismic can send us empty html elements which can lead to unwanted UI in templates.
  // Check that `asText` wouldn't return an empty string.
  return !maybeContent || asText(maybeContent) === '';
}

export function parseRichText(maybeContent: ?HTMLString) {
  return isMissingOrEmpty(maybeContent) ? null : maybeContent;
}

export function parseTitle(title: HTMLString): string {
  // We always need a title - blunt validation, but validation none the less
  return asText(title) || '';
}

export function parseTimestamp(frag: PrismicFragment): Date {
  return PrismicDate(frag);
}

export function parseTaslFromString(pipedString: string): Tasl {
  // We expect a string of title|author|sourceName|sourceLink|license|copyrightHolder|copyrightLink
  // e.g. Self|Rob Bidder|||CC-BY-NC
  try {
    const list = pipedString.split('|');
    const v = list
      .concat(Array(7 - list.length))
      .map(v => (!v.trim() ? null : v.trim()));

    const [
      title,
      author,
      sourceName,
      sourceLink,
      maybeLicense,
      copyrightHolder,
      copyrightLink,
    ] = v;
    const license: ?LicenseType = licenseTypeArray.find(
      l => l === maybeLicense
    );
    return {
      title,
      author,
      sourceName,
      sourceLink,
      license,
      copyrightHolder,
      copyrightLink,
    };
  } catch (e) {
    return {
      title: pipedString,
      author: null,
      sourceName: null,
      sourceLink: null,
      license: null,
      copyrightHolder: null,
      copyrightLink: null,
    };
  }
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

export function parseBoolean(fragment: PrismicFragment): boolean {
  return Boolean(fragment);
}

export function parseStructuredText(maybeFragment: ?any): ?HTMLString {
  return maybeFragment && isStructuredText((maybeFragment: HTMLString))
    ? (maybeFragment: HTMLString)
    : null;
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

export function parseFormat(frag: Object): ?Format {
  return isDocumentLink(frag)
    ? {
        id: frag.id,
        title: parseTitle(frag.data.title),
        description: asHtml(frag.data.description),
      }
    : null;
}

export function parseLink(link?: PrismicLink): ?string {
  if (link) {
    if (link.link_type === 'Web' || link.link_type === 'Media') {
      return link.url;
    } else if (link.link_type === 'Document' && isDocumentLink(link)) {
      return linkResolver(link);
    }
  }
}

// Prismic return `[ { type: 'paragraph', text: '', spans: [] } ]` when you have
// inserted text, then removed it, so we need to do this check.
export function isStructuredText(structuredTextObject: HTMLString): boolean {
  const text = asText(structuredTextObject);
  return Boolean(structuredTextObject) && (text || '').trim() !== '';
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
