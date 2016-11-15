import test from 'ava';
import parse5 from 'parse5';
import {cleanAttributes, addHttpsSrc, isSafeAttr, isNotEmpty, isNotEmptyText}  from '../../util/body-parser';

test('cleanAttributes', t => {
  const cleaned = cleanAttributes(parse5.parseFragment(
    '<a href="link/to/path" class="cutting-edge" id="things">Text here</p>'
  ).childNodes[0]);

  t.deepEqual([{name: 'href', value: 'link/to/path'}], cleaned.attrs);
});

test('addHttpsSrc', t => {
  const cleaned = addHttpsSrc(parse5.parseFragment(`
    <img src="http://path/to/image"
         srcset="http://path/to/image/1 500w, http://path/to/image/2 600w" />
  `.trim()).childNodes[0]);

  t.is(cleaned.attrs[0].value, 'https://path/to/image');
  t.is(cleaned.attrs[1].value, 'https://path/to/image/1 500w, https://path/to/image/2 600w');
});

test('isSafeAttr works off a black list', t => {
  t.is(false, isSafeAttr('id'));
  t.is(true, isSafeAttr('href'));
  t.is(true, isSafeAttr('blop'));
});

test('isNotEmpty needs a nodeName', t => {
  t.is(true, isNotEmpty({ nodeName: 'p' }));
  t.is(false, isNotEmpty({ nodeFace: 'p' }));
});

test('isNotEmptyText checks for text in a text node', t => {
  const fullTextNode = parse5.parseFragment('cutting edge').childNodes[0];
  const emptyTextNode = parse5.parseFragment('   ').childNodes[0];

  t.is(true, isNotEmptyText(fullTextNode));
  t.is(false, isNotEmptyText(emptyTextNode))
});
