import parse from 'parse5';
import url from 'url';
import {Record} from 'immutable';
import {ImageGallery} from '../model/image-gallery';
import {Picture} from '../model/picture';
import {Video} from '../model/video';
import {List} from '../model/list';

const BodyPart = Record({
  weight: 'default',
  type: null,
  value: null
});

export function bodyParser(bodyText) {
  const fragment = getFragment(bodyText);
  const preCleaned = cleanNodes(fragment.childNodes, [removeEmptyTextNodes]);
  const bodyParts = explodeIntoBodyParts(preCleaned);

  return bodyParts;
}

export function getFragment(bodyText) {
  return parse.parseFragment(bodyText);
}

export function explodeIntoBodyParts(nodes) {
  const parts = nodes.map((node, nodeIndex) => {
    const converters = [convertWpImage, convertWpVideo, convertWpList, findWpImageGallery];

    // TODO: Tidy up typing here
    const maybeBodyPart = nodeIndex === 0 ? convertWpStandfirst(node) :
      converters.reduce((node, converter) => {
        // Don't bother converting if it's been converted
        // We could use clever typing here, but we don't have to because JS
        return node.type ? node : converter(node);
      }, node);

    const bodyPart = maybeBodyPart.type ? maybeBodyPart : convertDomNode(maybeBodyPart);

    return bodyPart;
  }).filter(part => part); // get rid of any nulls = Maybe.flatten would be good.

  return parts;
}

export function removeEmptyTextNodes(nodes) {
  return nodes.filter(node => !isEmptyText(node));
}

function convertWpStandfirst(node) {
  return new BodyPart({
    type: 'standfirst',
    value: serializeAndCleanNode(node)
  });
}

export function convertWpImage(node) {
  const isWpImage = node.attrs && node.attrs.find(attr => attr.name === 'data-shortcode' && attr.value === 'caption');

  if (isWpImage) {
    const picture = getImageFromWpNode(node);

    return new BodyPart({
      type: 'picture',
      value: picture
    });
  } else {
    return node;
  }
}

export function convertWpVideo(node) {
  const maybeSpan = node.childNodes && node.childNodes[0];
  const isWpVideo = maybeSpan && maybeSpan.attrs && getAttrVal(maybeSpan.attrs, 'class') === 'embed-youtube';

  if (isWpVideo) {
    const iframe = maybeSpan.childNodes[0];
    const embedUrl = getAttrVal(iframe.attrs, 'src');
    const video = new Video({ embedUrl });

    return new BodyPart({
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

    const list = lis.map(li => {
      const itemVal = li.childNodes.reduce((html, node) => {
        return `${html}${serializeNode(node)}`;
      }, '');

      return itemVal;
    });

    return new BodyPart({
      type: 'list',
      value: new List({
        // TODO: We should be sending a name with all lists
        name: null,
        items: list
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
          const img = group.childNodes[0].childNodes[0].childNodes[0];
          const width = parseInt(getAttrVal(img.attrs, 'data-original-width'), 10);
          const height = parseInt(getAttrVal(img.attrs, 'data-original-height'), 10);
          const contentUrl = getAttrVal(img.attrs, 'data-orig-file');
          const caption = getAttrVal(img.attrs, 'alt');
          return new Picture({
            contentUrl,
            caption,
            width,
            height
          });
        });

      return new BodyPart({
        type: 'imageGallery',
        weight: 'standalone',
        value: new ImageGallery({
          name: null,
          items: images
        })
      });
    } catch(e) {
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

  const urlObj = url.parse(getAttrVal(img.attrs, 'data-orig-file'));
  const contentUrl = `https://${urlObj.hostname}${urlObj.pathname}`;
  const caption = captionNode.childNodes[0].value;
  const [width, height] = getAttrVal(img.attrs, 'data-orig-size').split(',');

  return new Picture({
    contentUrl,
    caption,
    url: href,
    width: parseInt(width, 10),
    height: parseInt(height, 10)
  });
}

export function convertDomNode(node) {
  const cleanedNode = serializeAndCleanNode(node);

  if (cleanedNode) {
    return new BodyPart({
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
