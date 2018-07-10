// @flow
import { RichText, Date as PrismicDate } from 'prismic-dom';
import type { HTMLString, PrismicFragment } from './types';
import type { Contributor, PersonContributor, OrganisationContributor } from '../../model/contributors';
import type { Picture } from '../../model/picture';
import type { Image } from '../../model/image';
import type { Tasl } from '../../model/tasl';
import type { LicenseType } from '../../model/license';
import type { Place } from '../../model/place';
import type { BackgroundTexture, PrismicBackgroundTexture } from '../../model/background-texture';
import type { CaptionedImage } from '../../model/captioned-image';
import type { ImagePromo } from '../../model/image-promo';
import { licenseTypeArray } from '../../model/license';
import { parsePage } from './pages';
import { parseEventSeries } from './event-series';
import isEmptyObj from '../../utils/is-empty-object';

const placeHolderImage = {
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
    copyrightLink: null
  }
};

const linkResolver = (doc) => {
  switch (doc.type) {
    case 'articles'      : return `/articles/${doc.id}`;
    case 'webcomics'     : return `/articles/${doc.id}`;
    case 'exhibitions'   : return `/exhibitions/${doc.id}`;
    case 'events'        : return `/events/${doc.id}`;
    case 'series'        : return `/series/${doc.id}`;
    case 'installations' : return `/installations/${doc.id}`;
    case 'pages'         : return `/pages/${doc.id}`;
  }
};

function isEmptyHtmlString(maybeContent: ?HTMLString): boolean {
  return maybeContent ? asHtml(maybeContent) === null : false;
}

export function asText(maybeContent: ?HTMLString): ?string {
  return maybeContent && RichText.asText(maybeContent).trim();
}

export function asHtml(maybeContent: ?HTMLString) {
  // Prismic can send us empty html elements which can lead to unwanted UI in templates.
  // Check that `asText` wouldn't return an empty string.
  const isEmpty = !maybeContent || (asText(maybeContent) || '').trim() === '';
  return isEmpty ? null : RichText.asHtml(maybeContent, linkResolver).trim();
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

export function parseDescription(description: HTMLString): HTMLString {
  return description;
}

export function parseTimestamp(frag: PrismicFragment): Date {
  return PrismicDate(frag);
}

// Deprecated, use parseImage
const placeholderImage = 'https://via.placeholder.com/160x90?text=placeholder';
export function parsePicture(captionedImage: Object, minWidth: ?string = null): Picture {
  const image = isEmptyObj(captionedImage.image) ? null : captionedImage.image;
  const tasl = image && parseTaslFromString(image.copyright);

  return ({
    contentUrl: (image && image.url) || placeholderImage,
    width: (image && image.dimensions && image.dimensions.width) || 160,
    height: (image && image.dimensions && image.dimensions.height) || 90,
    caption: captionedImage.caption && asHtml(captionedImage.caption),
    alt: image && image.alt,
    title: tasl && tasl.title,
    author: tasl && tasl.author,
    source: {
      name: tasl && tasl.sourceName,
      link: tasl && tasl.sourceLink
    },
    license: tasl && tasl.license,
    copyright: {
      holder: tasl && tasl.copyrightHolder,
      link: tasl && tasl.copyrightLink
    },
    minWidth
  }: Picture);
}

export function checkAndParseImage(frag: ?PrismicFragment): ?Image {
  return frag && (isImageLink(frag) ? parseImage(frag) : null);
}

// We don't export this, as we probably always want to check ^ first
function parseImage(frag: PrismicFragment): Image {
  const tasl = parseTaslFromString(frag.copyright);
  return {
    contentUrl: frag.url,
    width: frag.dimensions.width,
    height: frag.dimensions.height,
    alt: frag.alt,
    tasl: tasl
  };
}

type Crop = | '16:9' | '32:15' | 'square';
export function parseCaptionedImage(frag: PrismicFragment, crop?: Crop): CaptionedImage {
  if (isEmptyObj(frag.image)) {
    return {
      image: placeHolderImage,
      caption: [{
        type: 'paragraph',
        text: '',
        spans: []
      }]
    };
  }

  const image = crop ? frag.image[crop] : frag.image;
  const tasl = parseTaslFromString(image.copyright);

  return {
    image: {
      contentUrl: image.url,
      width: image.dimensions.width,
      height: image.dimensions.height,
      alt: image.alt || '',
      tasl
    },
    caption: !isEmptyHtmlString(frag.caption) ? frag.caption : []
  };
}

export function parsePromoToCaptionedImage(frag: PrismicFragment): CaptionedImage {
  // We could do more complicated checking here, but this is what we always use.
  const promo = frag[0];
  return parseCaptionedImage(promo.primary, '16:9');
}

const defaultContributorImage = {
  width: 64,
  height: 64,
  contentUrl: 'https://prismic-io.s3.amazonaws.com/wellcomecollection%2F3ed09488-1992-4f8a-9f0c-de2d296109f9_group+21.png',
  tasl: {
    sourceName: 'Unknown',
    title: null,
    author: null,
    sourceLink: null,
    license: null,
    copyrightHolder: null,
    copyrightLink: null
  },
  alt: ''
};

function parsePersonContributor(frag: PrismicFragment): PersonContributor {
  return {
    type: 'people',
    id: frag.id,
    name: frag.data.name || '',
    image: checkAndParseImage(frag.data.image) || defaultContributorImage,
    description: frag.data.description,
    twitterHandle: null
  };
}

function parseOrganisationContributor(frag: PrismicFragment): OrganisationContributor {
  return  {
    id: frag.id,
    type: 'organisations',
    name: asText(frag.data.name) || '',
    image: checkAndParseImage(frag.data.image) || defaultContributorImage,
    url: frag.data.url
  };
}

export function parseContributorsWithTitle(doc: PrismicFragment) {

}

export function parseContributors(contributorsDoc: PrismicFragment[]): Contributor[] {
  const contributors = contributorsDoc.map(contributor => {
    const role = contributor.role.isBroken === false ? {
      id: contributor.role.id,
      title: asText(contributor.role.data.title) || ''
    } : null;

    return (() => {
      switch (contributor.contributor.type) {
        case 'organisations':
          return {
            role,
            contributor: parseOrganisationContributor(contributor.contributor),
            description: parseStructuredText(contributor.description)
          };
        case 'people':
          return {
            role,
            contributor: parsePersonContributor(contributor.contributor),
            description: parseStructuredText(contributor.description)
          };
      }
    })();
  }).filter(Boolean);

  return contributors;
}

export function parseTaslFromString(pipedString: string): Tasl {
  // We expect a string of title|author|sourceName|sourceLink|license|copyrightHolder|copyrightLink
  // e.g. Self|Rob Bidder|||CC-BY-NC
  try {
    const list = pipedString.split('|');
    const v = list
      .concat(Array(7 - list.length))
      .map(v => !v.trim() ? null : v.trim());

    const [title, author, sourceName, sourceLink, maybeLicense, copyrightHolder, copyrightLink] = v;
    const license: ?LicenseType = licenseTypeArray.find(l => l === maybeLicense);
    return {title, author, sourceName, sourceLink, license, copyrightHolder, copyrightLink};
  } catch (e) {
    return {
      title: pipedString,
      author: null,
      sourceName: null,
      sourceLink: null,
      license: null,
      copyrightHolder: null,
      copyrightLink: null
    };
  }
}

// null is valid to use the default image,
// which isn't on a property, but rather at the root
type CropType = null | '16:9' | '32:15' | 'square';
export function parseImagePromo(
  frag: ?PrismicFragment[],
  cropType: CropType = '16:9',
  minWidth: ?string = null
): ?ImagePromo {
  const promoSlice = frag && frag.find(slice => slice.slice_type === 'editorialImage');
  const link = promoSlice && promoSlice.primary.link;
  // We introduced enforcing 16:9 half way through, so we have to do a check for it.
  const promoImage = promoSlice && cropType ? (promoSlice.primary.image[cropType] || promoSlice.primary.image) : promoSlice && promoSlice.primary.image;

  return promoSlice && ({
    caption: asText(promoSlice.primary.caption),
    image: checkAndParseImage(promoImage),
    link
  }: ImagePromo);
}

export function parsePlace(doc: PrismicFragment): Place {
  return {
    id: doc.id,
    title: asText(doc.data.title) || '',
    level: doc.data.level || 0,
    capacity: doc.data.capacity
  };
}

export function parseNumber(fragment: PrismicFragment): number {
  return parseInt(fragment, 10);
}

type PrismicPromoListFragment = {|
  type: string,
  link: {| url: string |},
  title: HTMLString,
  description: HTMLString,
  image: Picture
|}
type PromoListItem = {|
  contentType: string,
  url: string,
  title: string,
  description: string,
  image: Picture
|}
export function parsePromoListItem(item: PrismicPromoListFragment): PromoListItem {
  return {
    contentType: item.type,
    url: item.link.url,
    title: asText(item.title) || 'TITLE MISSING',
    description: asText(item.description) || '',
    image: parsePicture(item)
  };
}

export function parseBackgroundTexture(backgroundTexture: PrismicBackgroundTexture): BackgroundTexture {
  return {
    image: backgroundTexture.image.url,
    name: backgroundTexture.name
  };
}

export function parseBoolean(fragment: PrismicFragment): boolean {
  return Boolean(fragment);
}

function parseStructuredText(maybeFragment: ?PrismicFragment): ?HTMLString {
  return maybeFragment && isStructuredText(maybeFragment.description) ? maybeFragment.description : null;
}

// Prismic return `[ { type: 'paragraph', text: '', spans: [] } ]` when you have
// inserted text, then removed it, so we need to do this check.
export function isStructuredText(structuredTextObject: ?HTMLString): boolean {
  const text = asText(structuredTextObject);
  return Boolean(structuredTextObject) && (text || '').trim() !== '';
}

// If a link is non-existant, it can either be returned as `null`, or as an
// empty link object, which is why we use this
export function isDocumentLink(fragment: ?PrismicFragment): boolean {
  return Boolean(fragment && fragment.isBroken === false);
}

// when images have crops, event if the image isn't attached, we get e.g.
// { '32:15': {}, '16:9': {}, square: {} }
export function isImageLink(fragment: ?PrismicFragment): boolean {
  return Boolean(fragment && fragment.dimensions);
}

// We always get returned a { link_type: 'Web' } but it might not have a URL
export function isWebLink(fragment: ?PrismicFragment): boolean {
  return Boolean(fragment && fragment.url);
}

export type Weight = 'default' | 'featured';
function getWeight(weight: ?string): ?Weight {
  switch (weight) {
    case 'featured':
      return weight;

    default:
      return 'default';
  }
}

export function parseBody(fragment: PrismicFragment[]): any[] {
  return fragment.map((slice) => {
    switch (slice.slice_type) {
      case 'standfirst':
        return {
          type: 'standfirst',
          weight: getWeight(slice.slice_label),
          value: asHtml(slice.primary.text)
        };

      case 'text':
        return {
          type: 'text',
          weight: getWeight(slice.slice_label),
          value: slice.primary.text
        };

      case 'map':
        return {
          type: 'map',
          value: {
            title: asText(slice.primary.title),
            latitude: slice.primary.geolocation.latitude,
            longitude: slice.primary.geolocation.longitude
          }
        };

      case 'editorialImage':
        return {
          weight: getWeight(slice.slice_label),
          type: 'picture',
          value: parseCaptionedImage(slice.primary)
        };

      case 'editorialImageGallery':
        return {
          type: 'imageGallery',
          weight: getWeight(slice.slice_label),
          value: {
            title: asText(slice.primary.title),
            items: (slice.items.map(item => parseCaptionedImage(item)): CaptionedImage[])
          }
        };

      case 'contentList':
        return {
          type: 'contentList',
          weight: getWeight(slice.slice_label),
          value: {
            title: asText(slice.primary.title),
            items: slice.items.filter(
              // We have to do a check for data here, as if it's a linked piece
              // of content, we won't have this.
              item => !item.content.isBroken && item.content.data
            ).map(item => {
              switch (item.content.type) {
                case 'pages':
                  return parsePage(item.content);
                case 'event-series':
                  return parseEventSeries(item.content);
              }
            }).filter(Boolean)
          }
        };

      case 'searchResults':
        return {
          type: 'searchResults',
          weight: getWeight(slice.slice_label),
          value: {
            title: asText(slice.primary.title),
            query: slice.primary.query,
            pageSize: slice.primary.pageSize || 4
          }
        };

      case 'quote':
        return {
          type: 'quote',
          weight: getWeight(slice.slice_label),
          value: {
            text: slice.primary.text,
            citation: slice.primary.citation
          }
        };

      case 'embed':
        const embed = slice.primary.embed;

        if (embed.provider_name === 'YouTube') {
          const embedUrl = slice.primary.embed.html.match(/src="([-a-zA-Z0-9://.?=_]+)?/)[1];
          return {
            type: 'videoEmbed',
            weight: getWeight(slice.slice_label),
            value: {
              embedUrl: `${embedUrl}?rel=0`
            }
          };
        }
    }
  }).filter(Boolean);
}

// TODO: we need to get type in here to be able to union on these
// i.e. search results
type GenricContentFields = {|
  id: string,
  title: string,
  // contributorsTitle: ?string,
  contributors: Contributor[],
  promo: ?ImagePromo,
  body: any[]
|}
export function parseGenericFields(doc: PrismicFragment): GenricContentFields {
  const {data} = doc;
  return {
    id: doc.id,
    title: parseTitle(data.title),
    // contributorsTitle: asText(data.contributorsTitle),
    contributors: data.contributors ? parseContributors(data.contributors) : [],
    promo: data.promo && parseImagePromo(data.promo),
    body: data.body ? parseBody(data.body) : []
  };
}
