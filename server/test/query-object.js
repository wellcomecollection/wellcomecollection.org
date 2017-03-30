import test from 'ava';
import {Map} from 'immutable';
import {constructQueryFromQueryString} from '../services/wordpress';

test('constructQueryFromQueryString returns an empty object if empty', async t => {
  const q = constructQueryFromQueryString('');
  t.deepEqual(q, {});
});

test('constructQueryFromQueryString splits strings into a query object', async t => {
  const q = constructQueryFromQueryString('categories:cats tags:things,thangs');
  t.deepEqual(q, {categories: 'cats', tags: 'things,thangs'});
});

test('constructQueryFromQueryString excludes invalid search params', async t => {
  const q = constructQueryFromQueryString('categories:cats tags:things,thangs nolikey:this');
  t.deepEqual(q, {categories: 'cats', tags: 'things,thangs'});
});
