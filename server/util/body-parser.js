// TODO: Add flow (there is a lot of types to add if we do)
import parse from 'parse5';
import url from 'url';
import entities from 'entities';

import {createImageGallery} from '../model/image-gallery';
import type {Picture} from '../model/picture';
import {createPicture} from '../model/picture';
import {createVideo} from '../model/video';
import {createList} from '../model/list';
import {createTweet} from '../model/tweet';
import {createBodyPart} from '../model/body-part';
import {createHeading} from '../model/heading';
import {createInstagramEmbed} from '../model/instagram-embed';

export function bodyParser(bodyText) {
  const fragment = getFragment(bodyText);
  const preCleaned = cleanNodes(fragment.childNodes, [removeEmptyTextNodes, decodeHtmlEntities]);
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
      convertWpVideo,
      convertWpList,
      convertTweet,
      convertInstagramEmbed,
      findWpImageGallery,
      convertQuote
    ];

    // TODO: Tidy up typing here
    if (nodeIndex === 0) {
      const maybeImageNode = convertWpImage(node);
      const maybeVideoNode = convertWpVideo(node);

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

      return bodyPart;
    }
  }).filter(part => part); // get rid of any nulls = Maybe.flatten would be good.

  return parts;
}

export function removeEmptyTextNodes(nodes) {
  return nodes.filter(node => !isEmptyText(node));
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

function convertWpStandfirst(node) {
  return createBodyPart({
    type: 'standfirst',
    value: serializeAndCleanNode(unwrapFromEm(node))
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
      const footer = citation.length > 1 ? `<footer class="quote__footer"><cite class="quote__cite">${citation}</cite></footer>` : null;

      return { body, footer };
    } catch (err) {
      return {
        body: blockquote
      };
    }
  } else {
    return {
      body: blockquote
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
    const picture = getImageFromWpNode(node);
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
      value: picture
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

export function convertWpVideo(node) {
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
    const video = createVideo({ type: 'video', embedUrl, posterImage });

    return createBodyPart({
      type: 'video',
      value: video
    });
  } else {
    return node;
  }
}

export function convertWpList(node) {
  const isWpList = node.nodeName === 'ul';
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
            const width = parseInt(getAttrVal(img.attrs, 'data-original-width'), 10);
            const height = parseInt(getAttrVal(img.attrs, 'data-original-height'), 10);
            const contentUrl = getAttrVal(img.attrs, 'data-orig-file');
            const caption = getAttrVal(img.attrs, 'alt');
            return createPicture({
              contentUrl,
              caption,
              width,
              height
            });
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
  const href = mayBeWrapperA ? getAttrVal(mayBeWrapperA.attrs, 'href') : null;
  const captionNode = node.childNodes.find(node =>
    node.attrs && getAttrVal(node.attrs, 'class') === 'wp-caption-text'
  );
  const alt = getAttrVal(img.attrs, 'alt');
  const copyright = getAttrVal(img.attrs, 'data-image-description');

  // We need to lookup the src for images that aren't from the Wellcome Collection Wordpress
  const imgSrc = getAttrVal(img.attrs, 'data-orig-file') || getAttrVal(img.attrs, 'src');
  const urlObj = url.parse(imgSrc);

  const contentUrl = `https://${urlObj.hostname}${urlObj.pathname}`;
  const caption = captionNode ? captionNode.childNodes[0].value : null;
  // We need to lookup the dims for images that aren't from the Wellcome Collection Wordpress
  const [width, height] = (getAttrVal(img.attrs, 'data-orig-size') || `${getAttrVal(img.attrs, 'width')},${getAttrVal(img.attrs, 'height')}`).split(',');

  return createPicture({
    type: 'picture',
    contentUrl,
    caption,
    alt,
    copyright,
    url: href,
    width: parseInt(width, 10),
    height: parseInt(height, 10)
  });
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
