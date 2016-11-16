import parse from 'parse5';
const treeAdapter = parse.treeAdapters.default;

export default function bodyParser(bodyText) {
  const fragment = getFragment(bodyText);
  const nodes = cleanNodes(fragment.childNodes);
  return nodes;
}

export function getFragment(bodyText) {
  return parse.parseFragment(bodyText);
}

export function explodeIntoBodyParts(body) {
  const parts = body.childNodes.map(node => {
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

// This recursively cleans the nodes.
function cleanNodes(nodes) {
  return removeEmptyTextNodes(nodes).map(node => {
    if (node.childNodes) {
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
