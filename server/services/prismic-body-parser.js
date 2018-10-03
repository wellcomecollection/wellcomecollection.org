import type {ImageList} from '../content-model/content-blocks';
import {asHtml, asText, parseTaslFromString, prismicImage} from './prismic-parsers';
// $FlowFixMe
import {parseCaptionedImage, parseRichText} from '../../common/services/prismic/parsers';

export function parseBody(content) {
  return content.filter(slice => slice.slice_label !== 'featured').map(parseBodyPart).filter(_ => _);
}

export function parseFeaturedBody(content) {
  return content.filter(slice => slice.slice_label === 'featured').map(parseBodyPart).filter(_ => _);
}

function parseBodyPart(slice) {
  switch (slice.slice_type) {
    case 'standfirst':
      return {
        type: 'standfirst',
        weight: 'default',
        value: slice.primary.text
      };

    case 'text':
      return {
        type: 'text',
        weight: 'default',
        value: slice.primary.text
      };

    case 'editorialImage':
      return {
        weight: slice.slice_label,
        type: 'picture',
        value: parseCaptionedImage(slice.primary)
      };

    case 'editorialImageGallery':
      // TODO: add support for ~title~ & description / caption
      return {
        type: 'imageGallery',
        weight: 'standalone',
        value: {
          title: asText(slice.primary.title),
          items: slice.items.map(item => parseCaptionedImage(item))
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
            const image = parseCaptionedImage(item);
            const description = asHtml(item.description);
            const title = asText(item.title);
            const subtitle = asText(item.subtitle);
            return { title, subtitle, image, description };
          })
        }: ImageList)
      };

    case 'quoteV2':
      return {
        type: 'quoteV2',
        weight: 'default',
        value: {
          text: slice.primary.text,
          citation: slice.primary.citation,
          isPullOrReview: slice.slice_label === 'pull' || slice.slice_label === 'review'
        }
      };

    case 'excerpt':
      return {
        type: 'excerpt',
        weight: 'standalone',
        value: {
          title: asText(slice.primary.title),
          content: asText(slice.primary.content),
          source: slice.primary.source.data && {
            id: slice.primary.source.id,
            title: asText(slice.primary.source.data.title)
          },
          audio: slice.primary.audio.url
        }
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
      const embedUrl = slice.primary.embed.html.match(/src="([-a-zA-Z0-9://.?=_]+)?/)[1];
      return {
        type: 'video-embed',
        weight: slice.slice_label,
        value: {
          embedUrl: `${embedUrl}&rel=0`,
          title: asText(slice.primary.title),
          caption: parseRichText(slice.primary.caption)
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

    case 'gifVideo':
      return {
        type: 'gifVideo',
        weight: slice.slice_label,
        value: {
          caption: parseRichText(slice.primary.caption),
          videoUrl: slice.primary.video && slice.primary.video.url,
          playbackRate: slice.primary.playbackRate || 1,
          tasl: parseTaslFromString(slice.primary.tasl)
        }
      };

    case 'embed':
      return {
        type: 'embed',
        value: {
          embed: slice.primary.embed
        }
      };

    default:
      break;
  }
}
