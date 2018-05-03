// @flow
import { RichText, Date as PrismicDate } from 'prismic-dom';
import type { HTMLString, PrismicFragment } from './types';
import type { Contributor, PersonContributor, OrganisationContributor } from '../../model/contributors';
import type { Picture } from '../../model/picture';
import type { Tasl } from '../../model/tasl';
import type { LicenseType } from '../../model/license';
import type { Place } from '../../model/place';
import type { BackgroundTexture, PrismicBackgroundTexture } from '../../model/background-texture';
import type { CaptionedImageProps } from '../../views/components/Images/Images';
import { licenseTypeArray } from '../../model/license';
import { parseInfoPage } from './info-pages';

const placeHolderImage = {
  contentUrl: 'https://via.placeholder.com/1600x900?text=Placeholder',
  width: 160,
  height: 900,
  alt: 'Placeholder image',
  tasl: {
    contentUrl: 'https://via.placeholder.com/1600x900?text=Placeholder',
    isFull: false,
    sourceName: 'Unknown'
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
    case 'info-pages'    : return `/info/${doc.id}`;
  }
};

function isEmptyObj(obj: ?Object): boolean {
  return Object.keys((obj || {})).length === 0;
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

export function parseTitle(title: HTMLString): string {
  // We always need a title - blunt validation, but validation none the less
  return asText(title) || 'TITLE MISSING';
}

export function parseDescription(description: HTMLString): HTMLString {
  return description;
}

export function parseTimestamp(frag: PrismicFragment): Date {
  return PrismicDate(frag);
}

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

const defaultContributorImage = 'https://prismic-io.s3.amazonaws.com/wellcomecollection%2F3ed09488-1992-4f8a-9f0c-de2d296109f9_group+21.png';
type Crop = | '16:9' | '32:15' | 'square';
export function parseCaptionedImage(frag: PrismicFragment, crop?: Crop): CaptionedImageProps {
  if (isEmptyObj(frag.image)) {
    return {
      image: placeHolderImage,
      caption: [{
        type: 'paragraph',
        text: 'PLACEHOLDER CAPTION',
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
    caption: frag.caption
  };
}

export function parsePromoToCaptionedImage(frag: PrismicFragment): CaptionedImageProps {
  // We could do more complicated checking here, but this is what we always use.
  const promo = frag[0];
  return parseCaptionedImage(promo.primary, '16:9');
}

function parsePersonContributor(frag: PrismicFragment): PersonContributor {
  return {
    type: 'people',
    id: frag.id,
    name: frag.data.name || 'NAME MISSING',
    image: frag.data.image && parsePicture({
      image: frag.data.image
    }) ||  { width: 64, height: 64, contentUrl: defaultContributorImage },
    description: frag.data.description,
    twitterHandle: null
  };
}

function parseOrganisationContributor(frag: PrismicFragment): OrganisationContributor {
  return  {
    type: 'organisations',
    name: asText(frag.data.name) || 'NAME MISSING',
    image: frag.data.image && parsePicture({
      image: frag.data.image
    }) || { width: 64, height: 64, contentUrl: defaultContributorImage },
    url: frag.data.url
  };
}

export function parseContributors(contributorsDoc: PrismicFragment[]): Contributor[] {
  const contributors = contributorsDoc.map(contributor => {
    const role = contributor.role.isBroken === false ? {
      id: contributor.role.id,
      title: asText(contributor.role.data.title) || 'MISSING TITLE'
    } : null;

    return (() => {
      switch (contributor.contributor.type) {
        case 'organisations':
          return {
            role,
            contributor: parseOrganisationContributor(contributor.contributor),
            description: contributor.description
          };
        case 'people':
          return {
            role,
            contributor: parsePersonContributor(contributor.contributor),
            description: contributor.description
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

export type ImagePromo = {|
  caption: ?string;
  image: ?Picture;
|}
type CropType = '16:9' | '32:15' | 'square';
export function parseImagePromo(
  frag: ?PrismicFragment[],
  cropType: CropType = '16:9',
  minWidth: ?string = null
): ?ImagePromo {
  const maybePromo = frag && frag.find(slice => slice.slice_type === 'editorialImage');
  const hasImage = maybePromo && maybePromo.primary.image && isEmptyObj(maybePromo.primary.image) || false;

  return maybePromo && ({
    caption: asText(maybePromo.primary.caption),
    image: hasImage ? parsePicture({
      image:
        // We introduced enforcing 16:9 half way through, so we have to do a check for it.
        maybePromo.primary.image[cropType] || maybePromo.primary.image
    }, minWidth) : null
  }: ImagePromo);
}

export function parsePlace(doc: PrismicFragment): Place {
  return {
    id: doc.id,
    title: doc.data.title || 'Unknown',
    level: doc.data.level || 0,
    capacity: doc.data.capacity
  };
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

export function isDocumentLink(fragment: ?PrismicFragment): boolean {
  return Boolean(fragment && fragment.isBroken === false);
}

export function parseBody(fragment: PrismicFragment[]) {
  return fragment.map((slice) => {
    switch (slice.slice_type) {
      case 'standfirst':
        return {
          type: 'standfirst',
          weight: 'default',
          value: asHtml(slice.primary.text)
        };

      case 'text':
        return {
          type: 'text',
          weight: 'default',
          value: asHtml(slice.primary.text)
        };

      case 'editorialImage':
        return {
          weight: slice.slice_label,
          type: 'picture',
          value: parsePicture(slice.primary)
        };

      case 'editorialImageGallery':
        return {
          type: 'imageGallery',
          weight: 'standalone',
          value: {
            title: asText(slice.primary.title),
            items: (slice.items.map(item => parseCaptionedImage(item)): CaptionedImageProps[])
          }
        };

      case 'contentList':
        return {
          type: 'contentList',
          weight: 'default',
          value: {
            title: asText(slice.primary.title),
            items: slice.items.map(item => {
              if (item.content.type === 'info-pages') {
                return parseInfoPage(item.content);
              }
            }).filter(Boolean)
          }
        };

      case 'searchResults':
        return {
          type: 'searchResults',
          weight: 'default',
          value: {
            title: asText(slice.primary.title),
            query: slice.primary.query,
            pageSize: slice.primary.pageSize || 4
          }
        };
    }
  }).filter(Boolean);
}
