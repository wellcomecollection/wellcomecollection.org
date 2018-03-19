// @flow
import { RichText } from 'prismic-dom';
import { HTMLString } from './types';

export const licenseTypeArray = ['CC0', 'CC-BY', 'CC-BY-NC', 'CC-BY-NC-ND', 'PDM', 'copyright-not-cleared'];
export type LicenseType = | 'CC0' | 'CC-BY' | 'CC-BY-NC' | 'CC-BY-NC-ND' | 'PDM' | 'copyright-not-cleared';
export type License = {|
  subject?: string;
  licenseType: LicenseType;
|};

export function isEmptyObj(obj) {
  return obj === undefined || Object.keys(obj).length === 0;
}

const linkResolver = (doc) => {
  switch (doc.type) {
    case 'articles'    : return `/articles/${doc.id}`;
    case 'webcomics'   : return `/articles/${doc.id}`;
    case 'exhibitions' : return `/exhibitions/${doc.id}`;
    case 'events'      : return `/events/${doc.id}`;
    case 'series'      : return `/series/${doc.id}`;
  }
};

function asText(maybeContent: any) {
  return maybeContent && RichText.asText(maybeContent, linkResolver).trim();
}

function asHtml(maybeContent: any) {
  // Prismic can send us empty html elements which can lead to unwanted UI in templates.
  // Check that `asText` wouldn't return an empty string.
  const isEmpty = !maybeContent || asText(maybeContent).trim() === '';
  return isEmpty ? null : RichText.asHtml(maybeContent, linkResolver).trim();
}

export function parseTitle(title: HTMLString): string {
  return RichText.asText(title);
}

export function parseDescription(description: HTMLString): HTMLString {
  return description;
}

export function parseContributors(contributors): Contributor[] {
  const cs = contributors.map(contributor => {
    return (() => {
      switch (contributor.contributor.type) {
        case 'organisations':
          return {
            name: asText(contributor.contributor.data.name),
            image: contributor.contributor.data.image && parsePicture({
              image: contributor.contributor.data.image
            }),
            url: contributor.contributor.data.url
          };
        case 'people':
          return {
            name: asText(contributor.contributor.data.name),
            image: contributor.contributor.data.image && parsePicture({
              image: contributor.contributor.data.image
            })
          };
      }
    })();
  }).filter(_ => _);

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

export function parsePicture(captionedImage: Object, minWidth: ?string = null): Picture {
  const image = isEmptyObj(captionedImage.image) ? null : captionedImage.image;
  const tasl = image && parseTaslFromString(image.copyright);

  return ({
    type: 'picture',
    contentUrl: image && image.url,
    width: image && image.dimensions.width,
    height: image && image.dimensions.height,
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

export function parseBody(content) {
  return content.filter(slice => slice.slice_label !== 'featured').map(parseBodyPart).filter(_ => _);
}

function parseBodyPart(slice) {
  switch (slice.slice_type) {
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
      // TODO: add support for ~title~ & description / caption
      return {
        type: 'imageGallery',
        weight: 'standalone',
        value: {
          title: asText(slice.primary.title),
          items: slice.items.map(parsePicture)
        }
      };

    case 'imageList':
      return {
        weight: 'default',
        type: 'imageList',
        // TODO: We need to move things to using block types
        value: ({
          type: 'image-lists',
          blockType: 'image-lists',
          description: asText(slice.primary.description),
          listStyle: slice.primary.listStyle,
          items: slice.items.map(item => {
            const image = parsePicture(item);
            const description = asHtml(item.description);
            const title = asText(item.title);
            const subtitle = asText(item.subtitle);
            return { title, subtitle, image, description };
          })
        }: ImageList)
      };

    default:
      break;
  }
}
