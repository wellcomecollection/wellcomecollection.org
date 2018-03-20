// @flow
import { RichText } from 'prismic-dom';
import type { HTMLString, PrismicFragment } from './types';
import type { Contributor, PersonContributor, OrganisationContributor } from '../../model/contributors';
import type { Picture } from '../../model/picture';
import type { Tasl } from '../../model/tasl';
import type { LicenseType } from '../../model/license';
import { licenseTypeArray } from '../../model/license';

const linkResolver = (doc) => {
  switch (doc.type) {
    case 'articles'      : return `/articles/${doc.id}`;
    case 'webcomics'     : return `/articles/${doc.id}`;
    case 'exhibitions'   : return `/exhibitions/${doc.id}`;
    case 'events'        : return `/events/${doc.id}`;
    case 'series'        : return `/series/${doc.id}`;
    case 'installations' : return `/installations/${doc.id}`;
  }
};

function isEmptyObj(obj: ?Object): boolean {
  return Object.keys((obj || {})).length === 0;
}

function asText(maybeContent: ?HTMLString): ?string {
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

export function parsePicture(captionedImage: Object, minWidth: ?string = null): Picture {
  const image = isEmptyObj(captionedImage.image) ? null : captionedImage.image;
  const tasl = image && parseTaslFromString(image.copyright);

  return ({
    contentUrl: image && image.url,
    width: image && image.dimensions && image.dimensions.width,
    height: image && image.dimensions && image.dimensions.height,
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

function parsePersonContributor(frag: PrismicFragment): PersonContributor {
  return {
    contributorType: 'people',
    id: frag.id,
    name: frag.data.name || 'NAME MISSING',
    image: frag.data.image && parsePicture({
      image: frag.data.image
    }),
    description: frag.data.description,
    twitterHandle: null
  };
}

function parseOrganisationContributor(frag: PrismicFragment): OrganisationContributor {
  return  {
    contributorType: 'organisations',
    name: asText(frag.data.name) || 'NAME MISSING',
    image: frag.data.image && parsePicture({
      image: frag.data.image
    }),
    url: frag.data.url
  };
}

export function parseContributors(contributors: PrismicFragment[]): Contributor[] {
  const cs = contributors.map(contributor => {
    const role = !contributor.role.isBroken ? {
      id: contributor.role.id,
      title: asText(contributor.role.data.title) || 'MISSING TITLE'
    } : null;

    return (() => {
      switch (contributor.contributor.type) {
        case 'organisations':
          return {
            role,
            contributor: parseOrganisationContributor(contributor.contributor)
          };
        case 'people':
          return {
            role,
            contributor: parsePersonContributor(contributor.contributor)
          };
      }
    })();
  }).filter(Boolean);

  return cs;
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
  return maybePromo && ({
    caption: asText(maybePromo.primary.caption),
    image: parsePicture({
      image:
        // We introduced enforcing 16:9 half way through, so we have to do a check for it.
        maybePromo.primary.image[cropType] || maybePromo.primary.image
    }, minWidth)
  }: ImagePromo);
}
