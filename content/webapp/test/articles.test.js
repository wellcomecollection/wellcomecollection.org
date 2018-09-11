// @flow
import TestRenderer from 'react-test-renderer';
import httpMocks from 'node-mocks-http';
import {getArticle} from '@weco/common/services/prismic/articles';
import {ArticlePage} from '../pages/article';

it('renders <WorkPage /> with an catalogue API work response', async () => {
  const article = await getArticle(httpMocks.createRequest({
    method: 'GET',
    url: '/articles/W2qqOikAACkA7Tca'
  }), 'W2qqOikAACkA7Tca');

  expect(article).not.toBe(null);

  if (article) {
    const Page = TestRenderer.create(
      <ArticlePage article={article} />
    );
    expect(Page).not.toBe(null);
  }
});
