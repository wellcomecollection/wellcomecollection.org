import type {ImageList} from '../content-model/content-blocks';
import {RichText} from 'prismic-dom';
import {asHtml, asText, parsePicture, prismicImage} from './prismic-parsers';

export function parseBody(content) {
  return content.filter(slice => slice.slice_label !== 'featured').map(parseBodyPart).filter(_ => _);
}

function parseBodyPart(slice) {
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
          items: slice.items.map(item => {
            const image = parsePicture(item);
            const description = asHtml(item.description);
            const title = asText(item.title);
            const subtitle = asText(item.subtitle);
            return { title, subtitle, image, description };
          })
        }: ImageList)
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
    case 'vimeoVideoEmbed':
      // TODO: Not this ;﹏;
      const embedUrl = slice.primary.embed.html.match(/src="([a-zA-Z0-9://.]+)?/)[1];
      return {
        type: 'video-embed',
        weight: slice.slice_label,
        value: {
          embedUrl: embedUrl,
          title: asText(slice.primary.title),
          description: asText(slice.primary.description)
        }
      };

    case 'iframe':
      return {
        type: 'iframe',
        weight: slice.slice_label,
        value: {
          src: slice.primary.iframeSrc,
          image: prismicImage(slice.primary.previewImage)
        }
      };

    default:
      break;
  }
}
