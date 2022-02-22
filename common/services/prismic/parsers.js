// @flow
import { RichText, Date as PrismicDate } from 'prismic-dom';
// $FlowFixMe (tsx)
import { PrismicLink, HTMLString, PrismicFragment } from './types';
import flattenDeep from 'lodash.flattendeep';
import type { ImageType } from '../../model/image';
import type { Tasl } from '../../model/tasl';
import type { LicenseType } from '../../model/license';
import type { Format } from '../../model/format';
import type { Link } from '../../model/link';
import type {
  BackgroundTexture,
  PrismicBackgroundTexture,
} from '../../model/background-texture';
import type { CaptionedImage } from '../../model/captioned-image';
import type { ImagePromo } from '../../model/image-promo';
import type { LabelField } from '../../model/label-field';
import { licenseTypeArray } from '../../model/license';
import isEmptyObj from '../../utils/is-empty-object';
import { dasherize } from '../../utils/grammar';
import linkResolver from './link-resolver';
import type { HTMLSerializer } from 'prismic-reactjs';
import type { Element } from 'react';

export const placeHolderImage = ({
  contentUrl: 'https://via.placeholder.com/1600x900?text=%20',
  width: 160,
  height: 900,
  alt: 'Placeholder image',
  tasl: {
    sourceName: 'Unknown',
    title: null,
    author: null,
    sourceLink: null,
    license: null,
    copyrightHolder: null,
    copyrightLink: null,
  },
  crops: {},
}: ImageType);

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

export function checkAndParseImage(frag: ?PrismicFragment): ?ImageType {
  return frag && (isImageLink(frag) ? parseImage(frag) : null);
}

// These are the props returned on a prismic image object
const prismicImageProps = ['dimensions', 'alt', 'copyright', 'url'];
// We don't export this, as we probably always want to check ^ first
export function parseImage(frag: PrismicFragment): ImageType {
  const tasl = parseTaslFromString(frag.copyright);
  const crops = Object.keys(frag)
    .filter(key => prismicImageProps.indexOf(key) === -1)
    .filter(key => isImageLink(frag[key]))
    .map(key => ({
      key,
      image: parseImage(frag[key]),
    }))
    .reduce((acc, { key, image }) => {
      acc[key] = image;
      return acc;
    }, {});

  return {
    contentUrl: frag.url,
    width: frag.dimensions.width,
    height: frag.dimensions.height,
    alt: frag.alt,
    tasl: tasl,
    crops: crops,
  };
}

type Crop = '16:9' | '32:15' | 'square';
export function parseCaptionedImage(
  frag: PrismicFragment,
  crop?: ?Crop
): CaptionedImage {
  if (isEmptyObj(frag.image)) {
    return {
      image: placeHolderImage,
      caption: [
        {
          type: 'paragraph',
          text: '',
          spans: [],
        },
      ],
    };
  }

  const image = crop ? frag.image[crop] : frag.image;
  return {
    image: image.dimensions ? parseImage(image) : placeHolderImage,
    caption: !isEmptyHtmlString(frag.caption) ? frag.caption : [],
  };
}

export function parsePromoToCaptionedImage(
  frag: PrismicFragment,
  crop: ?Crop = '16:9'
): CaptionedImage {
  // We could do more complicated checking here, but this is what we always use.
  const promo = frag[0];
  return parseCaptionedImage(promo.primary, crop);
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

// null is valid to use the default image,
// which isn't on a property, but rather at the root
type CropType = null | '16:9' | '32:15' | 'square';
export function parseImagePromo(
  frag: ?(PrismicFragment[]),
  cropType: CropType = '16:9',
  minWidth: ?string = null
): ?ImagePromo {
  const promoSlice =
    frag && frag.find(slice => slice.slice_type === 'editorialImage');
  const link = promoSlice && promoSlice.primary.link;
  // We introduced enforcing 16:9 half way through, so we have to do a check for it.
  const promoImage =
    promoSlice && cropType
      ? promoSlice.primary.image[cropType] || promoSlice.primary.image
      : promoSlice && promoSlice.primary.image;

  return (
    promoSlice &&
    ({
      caption: asText(promoSlice.primary.caption),
      image: checkAndParseImage(promoImage),
      link,
    }: ImagePromo)
  );
}

export function parseBackgroundTexture(
  backgroundTexture: PrismicBackgroundTexture
): BackgroundTexture {
  return {
    image: backgroundTexture.image.url,
    name: backgroundTexture.name,
  };
}

export function parseLabelTypeList(
  fragment: PrismicFragment[],
  labelKey: string
): LabelField[] {
  return fragment
    .map(label => label[labelKey])
    .filter(Boolean)
    .filter(label => label.isBroken === false)
    .map(label => parseLabelType(label));
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

// when images have crops, event if the image isn't attached, we get e.g.
// { '32:15': {}, '16:9': {}, square: {} }
export function isImageLink(fragment: ?PrismicFragment): boolean {
  return Boolean(fragment && fragment.dimensions);
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
