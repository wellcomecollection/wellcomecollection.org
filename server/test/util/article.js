import test from 'ava';
import wpApiResp from '../mocks/wp-api.json';
import {ArticleFactory} from '../../model/articleV2';

test('articleV2', t => {
  const A = ArticleFactory.fromWpApi(wpApiResp);
  console.info(A);
});
