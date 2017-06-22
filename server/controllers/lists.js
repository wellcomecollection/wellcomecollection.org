import {getCuratedList} from '../services/prismic-curated-lists';
import {getArticleStubs} from '../services/wordpress';
import {PromoFactory} from '../model/promo';
import {createPageConfig} from '../model/page-config';

export async function explore(ctx, next) {
  const curatedList = await getCuratedList('explore');
  const articleStubs = await getArticleStubs(10);
  const promos = articleStubs.data.map(PromoFactory.fromArticleStub);

  ctx.render('pages/curated-lists', {
    pageConfig: createPageConfig({
      title: 'Articles',
      inSection: 'explore',
      category: 'list'
    }),
    promos,
    curatedList
  });
}
