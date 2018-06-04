// TODO: Add flow (there is a lot of types to add if we do)
import parse from 'parse5';
import url from 'url';
import entities from 'entities';

import {createImageGallery} from '../model/image-gallery';
import type {Picture} from '../model/picture';
import {createVideoEmbed} from '../model/video-embed';
import {createList} from '../model/list';
import {createTweet} from '../model/tweet';
import {createBodyPart} from '../model/body-part';
import {createHeading} from '../model/heading';
import {createInstagramEmbed} from '../model/instagram-embed';
import {striptags} from '../../common/utils/striptags';
import {createPrismicParagraph} from '../../common/utils/prismic';

export function bodyParser(bodyText) {
  const fragment = getFragment(bodyText);
  const preCleaned = cleanNodes(fragment.childNodes, [removeEmptyTextNodes, decodeHtmlEntities, removeHrs, removeScripts]);
  const bodyParts = explodeIntoBodyParts(preCleaned);

  return bodyParts;
}

export function getFragment(bodyText) {
  return parse.parseFragment(bodyText);
}

export function explodeIntoBodyParts(nodes) {
  const parts = nodes.map((node, nodeIndex) => {
    // Note to self - the type here should be:
    // (node: Node) => ?BodyPart
    const converters = [
      convertWpHeading,
      convertWpImage,
      convertWpYtVideo,
      convertWpList,
      convertTweet,
      convertInstagramEmbed,
      findWpImageGallery,
      convertQuote,
      convertWpVideo,
      convertPreformatedText,
      convertIframe,
      convertSlideshow,
      convertVimeo,
      convertAudio
    ];

    // TODO: Tidy up typing here
    if (nodeIndex === 0) {
      const maybeImageNode = convertWpImage(node);
      const maybeVideoNode = convertWpYtVideo(node);

      if (maybeVideoNode.type) {
        return maybeVideoNode;
      } else if (maybeImageNode.type) {
        return maybeImageNode;
      } else {
        return convertWpStandfirst(node);
      }
    } else {
      const maybeBodyPart = converters.reduce((node, converter) => {
        // Don't bother converting if it's been converted
        // We could use clever typing here, but we don't have to because JS
        return node.type ? node : converter(node);
      }, node);

      const bodyPart = maybeBodyPart.type ? maybeBodyPart : convertDomNode(maybeBodyPart);

      // Exclusions
      if (
        (bodyPart.type === 'html' && bodyPart.value.match('This slideshow requires JavaScript')) ||
        (bodyPart.type === 'html' && bodyPart.value.match('if lt IE 9'))
      ) {
        return null;
      } else {
        return bodyPart;
      }
    }
  }).filter(part => part); // get rid of any nulls = Maybe.flatten would be good.

  return parts;
}

export function removeEmptyTextNodes(nodes) {
  return nodes.filter(node => !isEmptyText(node));
}

function removeHrs(nodes) {
  return nodes.filter(node => node.nodeName !== 'hr');
}

function removeScripts(nodes) {
  return nodes.filter(node => node.nodeName !== 'scripts');
}

function decodeHtmlEntities(nodes) {
  return nodes.map(node => {
    if (node.nodeName === '#text') {
      const decodedVal = entities.decodeHTML(node.value);
      // Bah, more mutation - I wish I had a copy.
      node.value = decodedVal;
      return node;
    } else {
      return node;
    }
  });
}

function unwrapFromEm(node) {
  const firstChild = node.childNodes && node.childNodes[0];

  if (firstChild && firstChild.nodeName === 'em') {
    node.childNodes = firstChild.childNodes;
  }

  return node;
}

function convertSlideshow(node) {
  const dataGallery = node.attrs && getAttrVal(node.attrs, 'data-gallery');
  if (dataGallery) {
    const parsedData = JSON.parse(dataGallery);
    const images = parsedData.map(image => ({
      image: {
        contentUrl: image.src,
        caption: image.caption,
        alt: image.alt,
        width: 800 // this seems to be a width that works...
      },
      caption: [{
        type: 'paragraph',
        text: image.caption,
        spans: []
      }]
    }));

    return createBodyPart({
      type: 'imageGallery',
      weight: 'standalone',
      value: createImageGallery({
        items: images
      })
    });
  }

  return node;
}

function convertIframe(node) {
  if (node.nodeName === 'iframe') {
    const src = getAttrVal(node.attrs, 'src');
    const isSoundCloud = src.match('soundcloud');

    return isSoundCloud ? createBodyPart({
      type: 'soundcloudEmbed',
      value: {
        iframeSrc: src
      }
    }) : createBodyPart({
      type: 'iframe',
      value: { src }
    });
  }

  return node;
}

function convertWpStandfirst(node) {
  return createBodyPart({
    type: 'standfirst',
    value: [{
      type: 'paragraph',
      text: striptags(serializeAndCleanNode(unwrapFromEm(node))),
      spans: []
    }]
  });
}

export function convertWpHeading(node) {
  const headingMatch = node.nodeName.match(/h(\d)/);
  const isWpHeading = Boolean(headingMatch);
  const maybeHeadingContent = node.childNodes && node.childNodes[0];

  if (isWpHeading && maybeHeadingContent) {
    return createBodyPart({
      type: 'heading',
      value: createHeading({
        level: headingMatch[1],
        value: serializeAndCleanNode(maybeHeadingContent)
      })
    });
  } else {
    return node;
  }
}

function getWrappingTags(match) {
  const maybeTag = match[1];
  const isMatch = (maybeTag && maybeTag === match[2]);

  return {
    open: isMatch ? `<p><${maybeTag}>` : `<p>`,
    close: isMatch ? `</${maybeTag}></p>` : `</p>`
  };
}

function splitBlockquote(blockquote) {
  // Match a string within quote marks and capture possible non-<p> wrapping tags
  // Visualisation: https://regexper.com/#(%3F%3A%3C(%3F!p)(.*%3F)%3E)%3F%E2%80%9C%5B%5Cs%5CS%5D*%3F%E2%80%9D(%3F%3A.*%3C%5C%2F(%3F!p)(.*%3F)%3E)%3F
  const quoteAndTagsRegex = new RegExp(/(?:<(?!p)(.*?)>)?“[\s\S]*?”(?:.*<\/(?!p)(.*?)>)?/);
  const quoteAndTags = blockquote.match(quoteAndTagsRegex);

  if (quoteAndTags) {
    try {
      const wrapper = getWrappingTags(quoteAndTags);
      const quote = quoteAndTags[0].replace(/[“”]/g, '');
      const tagsRegex = new RegExp(/<[\s\S]*?>/, 'g');
      const citation = blockquote
        .slice(blockquote.lastIndexOf('”') + 1)
        .replace(tagsRegex, '');

      const body = `${wrapper.open}${quote}${wrapper.close}`;
      const footer = citation.length > 1 ? citation : null;

      return { body, footer, quote, citation };
    } catch (err) {
      return {
        body: blockquote, quote: blockquote
      };
    }
  } else {
    return {
      body: blockquote, quote: blockquote
    };
  }
}

export function convertQuote(node) {
  const isQuote = node.nodeName === 'blockquote';

  if (isQuote) {
    const content = serializeAndCleanNode(node.childNodes && node.childNodes[0]);

    return createBodyPart({
      type: 'quote',
      value: splitBlockquote(content)
    });
  } else {
    return node;
  }
}

export function convertWpImage(node) {
  const isWpImage = isCaption(node) || isImg(node);

  if (isWpImage) {
    const image = getImageFromWpNode(node);
    const className = getAttrVal(node.attrs, 'class') || '';
    const weights = {
      alignleft: 'supporting',
      alignright: 'standalone'
    };

    const weightKey = Object.keys(weights).find(wpClassName => className.indexOf(wpClassName) !== -1);
    const weight = weightKey ? weights[weightKey] : 'default';

    return createBodyPart({
      weight,
      type: 'picture',
      value: image
    });
  } else {
    return node;
  }
}

function isCaption(node) {
  return node.attrs && node.attrs.find(attr => attr.name === 'data-shortcode' && attr.value === 'caption');
}

function isImg(node) {
  const mayBeWrapperA = node.childNodes && node.childNodes.find(node => node.nodeName === 'a');
  const parentNode = mayBeWrapperA || node;

  return parentNode.childNodes && parentNode.childNodes[0] && parentNode.childNodes[0].nodeName === 'img';
}

function convertAudio(node) {
  if (node.nodeName === 'audio') {
    const link = node.childNodes && node.childNodes.find(node => node.nodeName === 'a');
    if (link) {
      const href = getAttrVal(link.attrs, 'href');
      return createBodyPart({
        type: 'html',
        value: `<p><a href=${href} target="_blank">Listen</a></p>`
      });
    }
  }
  return node;
}

function convertVimeo(node) {
  const iframe = node.nodeName === 'div' && node.childNodes && node.childNodes.find(node => node.nodeName === 'iframe');
  if (iframe && iframe.attrs && getAttrVal(iframe.attrs, 'src').match('vimeo')) {
    return createBodyPart({
      type: 'iframe',
      value: { src: getAttrVal(iframe.attrs, 'src') }
    });
  }

  return node;
}

export function convertWpYtVideo(node) {
  const maybeSpan = node.childNodes && node.childNodes[0];
  const isWpVideo = maybeSpan && maybeSpan.attrs && getAttrVal(maybeSpan.attrs, 'class') === 'embed-youtube';

  if (isWpVideo) {
    const iframe = maybeSpan.childNodes[0];
    const embedUrl = getAttrVal(iframe.attrs, 'src');
    const youtubeId = embedUrl.match(/embed\/[^?](.*)\?/)[1];
    const posterImage: Picture = {
      type: 'picture',
      contentUrl: `https://i3.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      width: 480,
      height: 360
    };
    const video = createVideoEmbed({ type: 'video-embed', embedUrl, posterImage });

    return createBodyPart({
      type: 'video-embed',
      value: video
    });
  } else {
    return node;
  }
}

function convertWpVideo(node) {
  const wpVideoMatch = node.nodeName === 'iframe' && getAttrVal(node.attrs, 'src').match(/^https:\/\/videopress.com\/embed/);
  if (wpVideoMatch) {
    return createBodyPart({
      type: 'wpVideo',
      value: serializeAndCleanNode(node)
    });
  } else {
    return node;
  }
}

export function convertPreformatedText(node) {
  const isPre = node.nodeName === 'pre';
  if (isPre) {
    const content = node.childNodes && node.childNodes[0];

    if (content) {
      return createBodyPart({
        type: 'pre',
        value: content.value,
        weight: 'standalone'
      });
    } else {
      return node;
    }
  } else {
    return node;
  }
}

export function convertWpList(node) {
  const isWpList = node.nodeName === 'ul' || node.nodeName === 'ol';
  if (isWpList) {
    // Make sure it's a list item and not empty
    const lis = node.childNodes.filter(n => n.nodeName === 'li' && n.childNodes);

    const listItems = lis.map(li => {
      const itemVal = li.childNodes.reduce((html, node) => {
        return `${html}${serializeNode(node)}`;
      }, '');

      return itemVal;
    });

    return createBodyPart({
      type: 'list',
      value: createList({
        // TODO: We should be sending a name with all lists
        name: null,
        items: listItems
      })
    });
  } else {
    return node;
  }
}

function convertInstagramEmbed(node) {
  const className = node.attrs && getAttrVal(node.attrs, 'class');
  const isInstagramEmbed = Boolean(className && className.match('instagram-media'));

  if (isInstagramEmbed) {
    return createBodyPart({
      type: 'instagramEmbed',
      value: createInstagramEmbed({
        html: serializeNode(node)
      })
    });
  } else {
    return node;
  }
}

function convertTweet(node) {
  const className = node.attrs && getAttrVal(node.attrs, 'class');
  const isTweet = Boolean(className && className.match('embed-twitter'));

  if (isTweet) {
    return createBodyPart({
      type: 'tweet',
      value: createTweet({
        html: serializeNode(node)
      })
    });
  } else {
    return node;
  }
}

export function findWpImageGallery(node) {
  const className = node.attrs && getAttrVal(node.attrs, 'class');
  const isWpImageGallery = Boolean(className && className.match('tiled-gallery'));

  if (isWpImageGallery) {
    try {
      const images =
        node.childNodes.filter(
          r => r.attrs && getAttrVal(r.attrs, 'class') === 'gallery-row'
        ).map(
          r => r.childNodes.filter(n => n.attrs && getAttrVal(n.attrs, 'class').match('gallery-group'))
        ).reduce((acc, group) => acc.concat(group)).map(group => {
          const imgs = group.childNodes && group.childNodes.map(galleryItem => {
            const img = galleryItem.childNodes[0].childNodes.find((node) => {
              return node.nodeName === 'img';
            });
            const dimensions = JSON.parse(`[${getAttrVal(img.attrs, 'data-orig-size')}]`);
            const width = dimensions[0];
            const height = dimensions[1];
            const contentUrl = getAttrVal(img.attrs, 'data-orig-file');
            const caption = getAttrVal(img.attrs, 'alt');
            return {
              image: {
                contentUrl,
                width,
                height,
                alt: caption
              },
              caption: [{
                type: 'paragraph',
                text: caption,
                spans: []
              }]
            };
          }) || [];
          return imgs;
        }).reduce((acc, imgs) => acc.concat(imgs));

      return createBodyPart({
        type: 'imageGallery',
        weight: 'standalone',
        value: createImageGallery({
          items: images
        })
      });
    } catch (e) {
      return node;
    }
  } else {
    return node;
  }
}

function getImageFromWpNode(node) {
  // Some images are wrappers in links
  const mayBeWrapperA = node.childNodes.find(node => node.nodeName === 'a');
  const parentNode = mayBeWrapperA || node;
  const img = parentNode.childNodes.find(node => node.nodeName === 'img');
  const captionNode = node.childNodes.find(node =>
    node.attrs && getAttrVal(node.attrs, 'class') === 'wp-caption-text'
  );
  const alt = getAttrVal(img.attrs, 'alt');

  // We need to lookup the src for images that aren't from the Wellcome Collection Wordpress
  const imgSrc = getAttrVal(img.attrs, 'data-orig-file') || getAttrVal(img.attrs, 'src');
  const urlObj = url.parse(imgSrc);

  const contentUrl = `https://${urlObj.hostname}${urlObj.pathname}`;
  const caption = captionNode ? serializeAndCleanNode(captionNode) : null;
  // We need to lookup the dims for images that aren't from the Wellcome Collection Wordpress
  const [width, height] = (getAttrVal(img.attrs, 'data-orig-size') || `${getAttrVal(img.attrs, 'width')},${getAttrVal(img.attrs, 'height')}`).split(',');

  return {
    type: 'picture',
    caption: caption && createPrismicParagraph(striptags(caption)),
    image: {
      contentUrl,
      alt,
      width: parseInt(width, 10),
      height: parseInt(height, 10),
      tasl: {}
    }
  };
}

export function convertDomNode(node) {
  const cleanedNode = serializeAndCleanNode(node);

  if (cleanedNode) {
    return createBodyPart({
      type: 'html',
      value: cleanedNode
    });
  } else {
    return null;
  }
}

export function removeExtraAttrs(nodes) {
  const superfluousAttrs = ['class', 'style'];
  return nodes.map(node => {
    if (node.attrs) {
      const cleanedAttrs = node.attrs.filter(attr => superfluousAttrs.indexOf(attr.name) === -1);
      // Boo! Mutation.
      node.attrs = cleanedAttrs;
      return node;
    } else {
      return node;
    }
  });
}

// This recursively cleans the nodes.
function cleanNodes(nodes, cleaners) {
  return cleaners.reduce((nodes, parser) => parser(nodes), nodes).map(node => {
    if (node.childNodes && node.childNodes.length > 0) {
      const childNodes = cleanNodes(node.childNodes, cleaners);
      return Object.assign({}, node, {childNodes});
    } else {
      return node;
    }
  });
}

function isEmptyText(node) {
  return node.nodeName === '#text' && node.value.trim() === '';
}

function getAttrVal(attrs, key) {
  const attr = attrs.find(attr => attr.name === key);
  return attr ? attr.value : null;
}

function serializeAndCleanNode(node) {
  const cleaned = cleanNodes([node], [removeExtraAttrs]);

  if (cleaned.length === 1) {
    return serializeNode(cleaned[0]);
  } else {
    return null;
  }
}

function serializeNode(node) {
  const treeAdapter = parse.treeAdapters.default;
  const frag = treeAdapter.createDocumentFragment();

  treeAdapter.appendChild(frag, node);

  return parse.serialize(frag);
}
