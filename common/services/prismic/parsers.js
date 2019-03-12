// @flow
import { RichText, Date as PrismicDate } from 'prismic-dom';
import type { HTMLString, PrismicFragment } from './types';
import type {
  Contributor,
  PersonContributor,
  OrganisationContributor,
} from '../../model/contributors';
import type { Picture } from '../../model/picture';
import type { ImageType } from '../../model/image';
import type { Tasl } from '../../model/tasl';
import type { LicenseType } from '../../model/license';
import type { Place } from '../../model/places';
import type {
  BackgroundTexture,
  PrismicBackgroundTexture,
} from '../../model/background-texture';
import type { CaptionedImage } from '../../model/captioned-image';
import type { ImagePromo } from '../../model/image-promo';
import type { GenericContentFields } from '../../model/generic-content-fields';
import type { LabelField } from '../../model/label-field';
import type { SameAs } from '../../model/same-as';
import type { HtmlSerializer } from './html-serialisers';
import { licenseTypeArray } from '../../model/license';
import { parsePage } from './pages';
import { parseEventSeries } from './event-series';
import isEmptyObj from '../../utils/is-empty-object';
import isEmptyDocLink from '../../utils/is-empty-doc-link';
import linkResolver from './link-resolver';

const placeHolderImage = ({
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

function isEmptyHtmlString(maybeContent: ?HTMLString): boolean {
  return maybeContent ? asHtml(maybeContent) === null : false;
}

export function asText(maybeContent: ?HTMLString): ?string {
  return maybeContent && RichText.asText(maybeContent).trim();
}

export function asHtml(
  maybeContent: ?HTMLString,
  htmlSerializer?: HtmlSerializer
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

export function parseDescription(description: HTMLString): HTMLString {
  return description;
}

export function parseTimestamp(frag: PrismicFragment): Date {
  return PrismicDate(frag);
}

// Deprecated, use parseImage
const placeholderImage = 'https://via.placeholder.com/160x90?text=placeholder';
export function parsePicture(
  captionedImage: Object,
  minWidth: ?string = null
): Picture {
  const image = isEmptyObj(captionedImage.image) ? null : captionedImage.image;
  const imageCopyright = image ? image.copyright : '';
  const tasl = parseTaslFromString(imageCopyright);

  return ({
    contentUrl: (image && image.url) || placeholderImage,
    width: (image && image.dimensions && image.dimensions.width) || 160,
    height: (image && image.dimensions && image.dimensions.height) || 90,
    alt: (image && image.alt) || '',
    tasl: tasl,
    minWidth,
  }: Picture);
}

export function checkAndParseImage(frag: ?PrismicFragment): ?ImageType {
  return frag && (isImageLink(frag) ? parseImage(frag) : null);
}

// These are the props returned on a prismic image object
const prismicImageProps = ['dimensions', 'alt', 'copyright', 'url'];
// We don't export this, as we probably always want to check ^ first
function parseImage(frag: PrismicFragment): ImageType {
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

export const defaultContributorImage = ({
  width: 64,
  height: 64,
  contentUrl:
    'https://prismic-io.s3.amazonaws.com/wellcomecollection%2F021d6105-3308-4210-8f65-d207e04c2cb2_contributor_default%402x.png',
  tasl: {
    sourceName: 'Unknown',
    title: null,
    author: null,
    sourceLink: null,
    license: null,
    copyrightHolder: null,
    copyrightLink: null,
  },
  alt: '',
  crops: {},
}: ImageType);

export function parseSameAs(frag: PrismicFragment[]): SameAs {
  return frag
    .filter(({ link, title }) => Boolean(link || title.length > 0))
    .map(({ link, title }) => {
      const autoTitle =
        link &&
        (link.startsWith('https://twitter.com/')
          ? `@${link.replace('https://twitter.com/', '')}`
          : link.match(/^https?:\/\//)
          ? link.replace(/^https?:\/\//, '')
          : null);

      return {
        link: link,
        title: asText(title) || autoTitle || link,
      };
    });
}

function parsePersonContributor(frag: PrismicFragment): PersonContributor {
  // As we don't have square images retrospectively, we fallback.
  const image = frag.data.image && (frag.data.image.square || frag.data.image);
  return {
    type: 'people',
    id: frag.id,
    name: frag.data.name || '',
    image: checkAndParseImage(image) || defaultContributorImage,
    description: frag.data.description,
    twitterHandle: null,
    sameAs: frag.data.sameAs ? parseSameAs(frag.data.sameAs) : [],
  };
}

function parseOrganisationContributor(
  frag: PrismicFragment
): OrganisationContributor {
  return {
    type: 'organisations',
    id: frag.id,
    name: asText(frag.data.name) || '',
    image: checkAndParseImage(frag.data.image) || defaultContributorImage,
    url: frag.data.url,
    description: frag.data.description,
    sameAs: frag.data.sameAs ? parseSameAs(frag.data.sameAs) : [],
  };
}

export function parseContributors(
  contributorsDoc: PrismicFragment[]
): Contributor[] {
  const contributors = contributorsDoc
    .map(contributor => {
      const role =
        contributor.role.isBroken === false
          ? {
              id: contributor.role.id,
              title: asText(contributor.role.data.title) || '',
            }
          : null;

      return (() => {
        switch (contributor.contributor.type) {
          case 'organisations':
            return {
              role,
              contributor: parseOrganisationContributor(
                contributor.contributor
              ),
              description: parseStructuredText(contributor.description),
            };
          case 'people':
            return {
              role,
              contributor: parsePersonContributor(contributor.contributor),
              description: parseStructuredText(contributor.description),
            };
        }
      })();
    })
    .filter(Boolean);

  return contributors;
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

export function parsePlace(doc: PrismicFragment): Place {
  const genericFields = parseGenericFields(doc);
  return {
    ...genericFields,
    level: doc.data.level || 0,
    capacity: doc.data.capacity,
    information: doc.data.locationInformation,
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
  image: Picture,
|};
type PromoListItem = {|
  contentType: string,
  url: string,
  title: string,
  description: string,
  image: Picture,
|};
export function parsePromoListItem(
  item: PrismicPromoListFragment
): PromoListItem {
  return {
    contentType: item.type,
    url: item.link.url,
    title: asText(item.title) || 'TITLE MISSING',
    description: asText(item.description) || '',
    image: parsePicture(item),
  };
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

function parseStructuredText(maybeFragment: ?any): ?HTMLString {
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

// We always get returned a { link_type: 'Web' } but it might not have a URL
export function isWebLink(fragment: ?PrismicFragment): boolean {
  return Boolean(fragment && fragment.url);
}

export type Weight = 'default' | 'featured' | 'standalone' | 'supporting';
function getWeight(weight: ?string): ?Weight {
  switch (weight) {
    case 'featured':
      return weight;
    case 'standalone':
      return weight;
    case 'supporting':
      return weight;
    default:
      return 'default';
  }
}

export function parseBody(fragment: PrismicFragment[]): any[] {
  return fragment
    .map(slice => {
      switch (slice.slice_type) {
        case 'standfirst':
          return {
            type: 'standfirst',
            weight: getWeight(slice.slice_label),
            value: slice.primary.text,
          };

        case 'text':
          return {
            type: 'text',
            weight: getWeight(slice.slice_label),
            value: slice.primary.text,
          };

        case 'map':
          return {
            type: 'map',
            value: {
              title: asText(slice.primary.title),
              latitude: slice.primary.geolocation.latitude,
              longitude: slice.primary.geolocation.longitude,
            },
          };

        case 'editorialImage':
          return {
            weight: getWeight(slice.slice_label),
            type: 'picture',
            value: parseCaptionedImage(slice.primary),
          };

        case 'editorialImageGallery':
          return {
            type: 'imageGallery',
            weight: getWeight(slice.slice_label),
            value: {
              title: asText(slice.primary.title),
              items: (slice.items.map(item =>
                parseCaptionedImage(item)
              ): CaptionedImage[]),
            },
          };

        case 'contentList':
          return {
            type: 'contentList',
            weight: getWeight(slice.slice_label),
            value: {
              title: asText(slice.primary.title),
              items: slice.items
                .filter(
                  // We have to do a check for data here, as if it's a linked piece
                  // of content, we won't have this.
                  item => item.content.isBroken === false && item.content.data
                )
                .map(item => {
                  switch (item.content.type) {
                    case 'pages':
                      return parsePage(item.content);
                    case 'event-series':
                      return parseEventSeries(item.content);
                  }
                })
                .filter(Boolean),
            },
          };

        case 'searchResults':
          return {
            type: 'searchResults',
            weight: getWeight(slice.slice_label),
            value: {
              title: asText(slice.primary.title),
              query: slice.primary.query,
              pageSize: slice.primary.pageSize || 4,
            },
          };

        case 'quote':
        case 'quoteV2':
          return {
            type: 'quote',
            weight: getWeight(slice.slice_label),
            value: {
              text: slice.primary.text,
              citation: slice.primary.citation,
              isPullOrReview:
                slice.slice_label === 'pull' || slice.slice_label === 'review',
            },
          };

        case 'iframe':
          return {
            type: 'iframe',
            weight: slice.slice_label,
            value: {
              src: slice.primary.iframeSrc,
              image: parseImage(slice.primary.previewImage),
            },
          };

        case 'gifVideo':
          return {
            type: 'gifVideo',
            weight: slice.slice_label,
            value: {
              caption: parseRichText(slice.primary.caption),
              videoUrl: slice.primary.video && slice.primary.video.url,
              playbackRate: slice.primary.playbackRate || 1,
              tasl: parseTaslFromString(slice.primary.tasl),
            },
          };

        case 'embed':
          const embed = slice.primary.embed;

          if (embed.provider_name === 'Vimeo') {
            const embedUrl = slice.primary.embed.html.match(
              /src="([-a-zA-Z0-9://.?=_]+)?/
            )[1];
            return {
              type: 'videoEmbed',
              weight: getWeight(slice.slice_label),
              value: {
                embedUrl: `${embedUrl}?rel=0`,
                caption: slice.primary.caption,
              },
            };
          }

          if (embed.provider_name === 'SoundCloud') {
            const apiUrl = embed.html.match(/url=([^&]*)&/);
            const secretToken = embed.html.match(/secret_token=([^"]*)"/);

            return {
              type: 'soundcloudEmbed',
              weight: getWeight(slice.slice_label),
              value: {
                embedUrl: `https://w.soundcloud.com/player/?url=${
                  apiUrl[1]
                }%3Fsecret_token%3D${
                  secretToken[1]
                }&color=%23ff5500&inverse=false&auto_play=false&show_user=true`,
                caption: slice.primary.caption,
              },
            };
          }

          if (embed.provider_name === 'YouTube') {
            const embedUrl = slice.primary.embed.html.match(
              /src="([-a-zA-Z0-9://.?=_]+)?/
            )[1];
            return {
              type: 'videoEmbed',
              weight: getWeight(slice.slice_label),
              value: {
                embedUrl: `${embedUrl}?rel=0`,
                caption: slice.primary.caption,
              },
            };
          }
          break;

        // Deprecated
        case 'imageList':
          return {
            type: 'deprecatedImageList',
            weight: getWeight(slice.slice_label),
            value: {
              items: slice.items.map(item => ({
                title: parseTitle(item.title),
                subtitle: parseTitle(item.subtitle),
                image: parseCaptionedImage(item),
                description: parseStructuredText(item.description),
              })),
            },
          };
      }
    })
    .filter(Boolean);
}

export function parseGenericFields(doc: PrismicFragment): GenericContentFields {
  const { data } = doc;
  const promo = data.promo && parseImagePromo(data.promo);
  const contributors =
    data.contributors &&
    data.contributors.filter(c => !isEmptyDocLink(c.contributor));

  const promoImages =
    data.promo && data.promo.length > 0
      ? data.promo
          .filter(slice => slice.primary.image)
          .map(({ primary: { image } }) => {
            const originalImage = isImageLink(image) && parseImage(image);
            const squareImage =
              image.square &&
              isImageLink(image.square) &&
              parseImage(image.square);
            const widescreenImage =
              image['16:9'] &&
              isImageLink(image['16:9']) &&
              parseImage(image['16:9']);

            return { image: originalImage, squareImage, widescreenImage };
          })
          .find(_ => _)
      : {}; // just get the first one;

  const { image, squareImage, widescreenImage } = promoImages;
  const body = data.body ? parseBody(data.body) : [];
  const standfirst = body.find(slice => slice.type === 'standfirst');
  const metadataDescription = asText(data.metadataDescription);

  return {
    id: doc.id,
    title: parseTitle(data.title),
    contributorsTitle: asText(data.contributorsTitle),
    contributors: contributors ? parseContributors(contributors) : [],
    body: body,
    standfirst: standfirst && standfirst.value,
    promo: promo,
    promoText: promo && promo.caption,
    promoImage: promo && promo.image,
    image,
    squareImage,
    widescreenImage,
    metadataDescription,
    // we pass an empty array here to be overriden by each content type
    // TODO: find a way to enforce this.
    labels: [],
  };
}
