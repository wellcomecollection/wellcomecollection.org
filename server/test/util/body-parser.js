import test from 'ava';
import parse from 'parse5';
import exploreApiResp from '../mocks/explore-api.json';
import wpApiResp from '../mocks/wp-api.json';
import {
  bodyParser,
  getFragment,
  removeEmptyTextNodes,
  removeExtraAttrs,
  convertDomNode,
  convertWpImage,
  convertWpVideo,
  findWpImageGallery
} from '../../util/body-parser';
import {domNodeHtml, wpImageNodeHtml, wpVideoNodeHtml} from '../mocks/dom-nodes';

test('removeEmptyTextNodes', t => {
  const fragment = getFragment(exploreApiResp.articleBody);
  const uncleanNodes = fragment.childNodes;
  const cleanNodes = removeEmptyTextNodes(fragment.childNodes);

  t.is(uncleanNodes.length, 18);
  t.is(cleanNodes.length, 9);
});

test('removeExtraAttrs', t => {
  // Not using a string template here to avoid empty text nodes
  const fragment = getFragment(
    '<p class="notwelcome">Hello</p>' +
    '<p style="notwelcome">Hello</p>' +
    '<p title="notwelcome">Hello</p>'
  );

  const cleanNodes = removeExtraAttrs(fragment.childNodes);

  t.is(cleanNodes[0].attrs.length, 0);
  t.is(cleanNodes[1].attrs.length, 0);
  t.is(cleanNodes[2].attrs.length, 1);
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

test('findWpImageGallery', t => {
  const bodyParts = bodyParser(wpApiResp.content);
  const wpImageGalleries = bodyParts.filter(part => part.type === 'imageGallery');
  t.is(wpImageGalleries.length, 1);
});
