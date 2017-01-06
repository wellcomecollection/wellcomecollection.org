import test from 'ava';
import parse from 'parse5';
import exploreApiResp from '../mocks/explore-api.json';
import {
  getFragment,
  removeEmptyTextNodes,
  convertDomNode,
  convertWpImage,
  convertWpVideo
} from '../../util/body-parser';
import {domNodeHtml, wpImageNodeHtml, wpVideoNodeHtml} from '../mocks/dom-nodes';

test('removeEmptyTextNodes', t => {
  const fragment = getFragment(exploreApiResp.articleBody);
  const uncleanNodes = fragment.childNodes;
  const cleanNodes = removeEmptyTextNodes(fragment.childNodes);

  t.is(uncleanNodes.length, 18);
  t.is(cleanNodes.length, 9);
});

test('convertDomNode', t => {
  const domNode = parse.parseFragment(domNodeHtml).childNodes[0];
  const n = convertDomNode(domNode);

  t.is(n.type, 'html');
});

test('convertWpImage', t => {
  const wpImageNode = parse.parseFragment(wpImageNodeHtml).childNodes[0];
  const i = convertWpImage(wpImageNode);
  t.is(i.value.contentUrl, 'https://wellcomecollection.files.wordpress.com/2016/12/865c27bde0241fe5fc47cfb40826.jpg');
  t.is(i.value.width, 800);
  t.is(i.value.height, 521);
  t.is(
    i.value.caption,
    'The typical canon-ball shaped plum pudding pictured as the grand finale of the British Christmas feast.'
  );
});

test('convertWpVideo', t => {
  const wpVideoNode = parse.parseFragment(wpVideoNodeHtml).childNodes[0];
  const v = convertWpVideo(wpVideoNode);

  t.is(
    v.value.embedUrl,
    'https://www.youtube.com/embed/bfXAlqx0H1g?version=3&rel=1&fs=1&autohide=2&showsearch=0&showinfo=1&iv_load_policy=1&wmode=transparent'
  );
});
