import type {ImagePromo, ImageList} from '../content-model/content-blocks';
import type {Picture} from '../model/picture';
import Prismic from 'prismic-javascript';
import {List} from 'immutable';
import {RichText, Date as PrismicDate} from 'prismic-dom';
import {prismicApi} from './prismic-api';
import {isEmptyObj} from '../util/is-empty-obj';
import {parseArticleDoc, parseWebcomicDoc} from './prismic-parsers';

export function getPublishedDate(doc) {
  // We fallback to `Date.now()` in case we're in preview and don't have a published date
  // This is because we need to have a separeate `publishDate` for articles imported from WP
  return PrismicDate(doc.data.publishDate || doc.first_publication_date || Date.now());
}

export function getPromo(doc): ?ImagePromo {
  const maybePromo = doc.data.promo.find(slice => slice.slice_type === 'editorialImage');
  return maybePromo && ({
    text: asText(maybePromo.primary.caption),
    media: prismicImageToPicture({image: maybePromo.primary.image})
  }: ImagePromo);
}

export function getFeaturedMediaFromBody(doc): ?(Picture | ImageList) {
  return List(doc.data.body.filter(slice => slice.slice_label === 'featured')
    .map(slice => {
      switch (slice.slice_type) {
        case 'editorialImage': return prismicImageToPicture(slice.primary);
        case 'imageList': return convertPrismicImageList(slice);
      }
    })).first();
}

export function prismicImageToPicture(captionedImage) {
  const image = isEmptyObj(captionedImage.image) ? null : captionedImage.image;
  const tasl = image && image.copyright && getTaslFromCopyright(image.copyright);

  return ({
    type: 'picture',
    contentUrl: image && image.url,
    width: image && image.dimensions.width,
    height: image && image.dimensions.height,
    caption: captionedImage.caption && captionedImage.caption.length !== 0 && asHtml(captionedImage.caption),
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
    }
  }: Picture);
}

function convertPrismicImageList(slice): ImageList {
  return ({
    // TODO: We need to move things to using block types
    type: 'image-lists',
    blockType: 'image-lists',
    description: asText(slice.primary.description),
    items: slice.items.map(item => {
      const image = prismicImageToPicture(item);
      const description = RichText.asHtml(item.description);
      const title = asText(item.title);
      const subtitle = asText(item.subtitle);
      return { title, subtitle, image, description };
    })
  }: ImageList);
}

export function getTaslFromCopyright(copyright) {
  // We expect a string of title|author|sourceName|sourceLink|license|copyrightHolder|copyrightLink
  // e.g. Self|Rob Bidder|||CC-BY-NC
  try {
    const list = copyright.split('|');
    const v = list
      .concat(Array(7 - list.length))
      .map(v => !v.trim() ? null : v.trim());

    const [title, author, sourceName, sourceLink, license, copyrightHolder, copyrightLink] = v;
    return {title, author, sourceName, sourceLink, license, copyrightHolder, copyrightLink};
  } catch (e) {
    return copyright;
  }
}

export function convertContentToBodyParts(content) {
  // TODO: Add these as ContentBlocks when the model is in
  return content.filter(slice => slice.slice_label !== 'featured').map(slice => {
    switch (slice.slice_type) {
      case 'standfirst':
        return {
          type: 'standfirst',
          weight: 'default',
          value: RichText.asHtml(slice.primary.text)
        };

      case 'text':
        return {
          type: 'text',
          weight: 'default',
          value: RichText.asHtml(slice.primary.text)
        };

      case 'editorialImage':
        return {
          weight: slice.slice_label,
          type: 'picture',
          value: prismicImageToPicture(slice.primary)
        };

      case 'editorialImageGallery':
        // TODO: add support for ~title~ & description / caption
        return {
          type: 'imageGallery',
          weight: 'standalone',
          value: {
            title: asText(slice.primary.title),
            items: slice.items.map(prismicImageToPicture)
          }
        };

      case 'imageList':
        return {
          weight: 'default',
          type: 'imageList',
          value: convertPrismicImageList(slice)
        };

      case 'quote':
        // TODO: Support citation link
        return {
          type: 'quote',
          weight: 'default',
          value: {
            body: RichText.asHtml(slice.primary.quote),
            footer: slice.primary.citation && slice.primary.source ? `${slice.primary.citation} - ${slice.primary.source}` : null,
            quote: RichText.asHtml(slice.primary.quote),
            citation: `${slice.primary.citation} - ${slice.primary.source}`
          }
        };

      case 'excerpt':
        return {
          type: 'pre',
          name: '',
          weight: 'standalone',
          value: asText(slice.primary.content)
        };

      case 'instagramEmbed':
        return {
          type: 'instagramEmbed',
          value: {
            html: slice.primary.embed.html
          }
        };

      case 'twitterEmbed':
        return {
          type: 'tweet',
          value: {
            html: slice.primary.embed.html
          }
        };

      case 'soundcloudEmbed':
        return {
          type: 'soundcloudEmbed',
          value: {
            iframeSrc: slice.primary.iframeSrc
          }
        };

      case 'youtubeVideoEmbed':
        // TODO: Not this ;﹏;
        const embedUrl = slice.primary.embed.html.match(/src="([a-zA-Z0-9://.]+)?/)[1];
        return {
          type: 'video-embed',
          value: {
            embedUrl: embedUrl
          }
        };

      case 'iframeSrc':
        return {
          type: 'iframe',
          weight: slice.slice_label,
          value: {
            src: slice.value
          }
        };

      default:
        break;
    }
  }).filter(_ => _);
}

export function asText(maybeContent) {
  return maybeContent && RichText.asText(maybeContent).trim();
}

export function asHtml(maybeContent) {
  return maybeContent && RichText.asHtml(maybeContent).trim();
}
