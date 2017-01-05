import parse from 'parse5';
import {Image} from '../model/image';

const treeAdapter = parse.treeAdapters.default;

export default function bodyParser(bodyText) {
  const fragment = getFragment(bodyText);
  const nodes = explodeIntoBodyParts(cleanNodes(fragment.childNodes));
  return nodes;
}

export function getFragment(bodyText) {
  return parse.parseFragment(bodyText);
}

export function explodeIntoBodyParts(nodes) {
  const parts = nodes.map(node => {
    const frag = treeAdapter.createDocumentFragment();
    treeAdapter.appendChild(frag, node);

    return {
      nodeName: node.nodeName,
      value: parse.serialize(frag)
    };
  });

  return parts;
}

export function removeEmptyTextNodes(nodes) {
  return nodes.filter(node => !isEmptyText(node));
}

function cleanWpImages(nodes) {
  return nodes.map(node => {
    const isWpImage = node.attrs && node.attrs.find(attr => attr.name === 'data-shortcode' && attr.value === 'caption');

    if (isWpImage) {
      const image = getImageFromWpNode(node);
      return {
        nodeName: 'img',
        value: image
      };
    } else {
      return node;
    }
  });
}

export function getImageFromWpNode(node) {
  const img = node.childNodes.find(node => node.nodeName === 'img');
  const caption = getAttrVal(img.attrs, 'data-image-description').replace(/<\/?p>/g, '').trim();
  const [width, height] = getAttrVal(img.attrs, 'data-orig-size').split(',');

  return new Image({
    caption,
    width: parseInt(width, 10),
    height: parseInt(height, 10)
  });
}

// This recursively cleans the nodes.
function cleanNodes(nodes) {
  const parsers = [
    removeEmptyTextNodes,
    cleanWpImages
  ];

  return parsers.reduce((nodes, parser) => {
    return parser(nodes);
  }, nodes).map(node => {
    if (node.childNodes && node.childNodes.length > 0) {
      const childNodes = cleanNodes(node.childNodes);
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
