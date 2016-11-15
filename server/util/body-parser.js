// TODO: Think about using Immutable here, Object.assign is getting boring.
import parse5 from 'parse5';
const treeAdapter = parse5.treeAdapters.default;

export default function bodyParser(body) {
  const fragment = parse5.parseFragment(body);
  const filteredAndCleaned = filterAndClean(fragment);
  const parts = filteredAndCleaned.childNodes.map(node => {
    const frag = treeAdapter.createDocumentFragment();
    treeAdapter.appendChild(frag, node);
    return {
      nodeName: node.nodeName,
      value: parse5.serialize(frag)
    };
  });

  return parts;
}

export function filterAndClean(node) {
  const childNodes = (node.childNodes || []).filter(isNotEmpty).filter(isNotEmptyText).map(filterAndClean);
  const cleanNode = addHttpsSrc(cleanAttributes(node));

  if (cleanNode) {
    return Object.assign({}, cleanNode, childNodes ? {childNodes} : {});
  } else {
    return null;
  }
}

export function addHttpsSrc(node) {
  if (node.attrs) {
    const attrs = node.attrs.map(attr => {
      if (attr.name === 'src' || attr.name === 'srcset') {
        return Object.assign({}, attr, {value: attr.value.replace(/http:/g, 'https:')});
      } else {
        return attr;
      }
    });

    return Object.assign({}, node, { attrs });
  } else {
    return node;
  }
}

export function cleanAttributes(node) {
  if (node.attrs) {
    const attrs = node.attrs.filter(attr => isSafeAttr(attr.name));
    return Object.assign({}, node, {attrs});
  } else {
    return node;
  }
}

export function isSafeAttr(attrName) {
  const badAttrs = ['class', 'id', 'target', 'style'];
  return badAttrs.indexOf(attrName) === -1 && !/data-*/.test(attrName);
}

export function isNotEmpty(node) {
  return node.nodeName !== undefined;
}

export function isNotEmptyText(node) {
  return !(node.nodeName === '#text' && node.value.trim() === '');
}
