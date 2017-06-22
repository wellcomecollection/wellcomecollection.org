import {getCuratedList} from '../services/prismic-curated-lists';
import {getArticleStubs} from '../services/wordpress';
import {PromoFactory} from '../model/promo';
import {createPageConfig} from '../model/page-config';
import {collectorsPromo} from '../data/series';

export async function explore(ctx, next) {
  // TODO: Remove WP content
  const listRequests = [getCuratedList('explore'), getArticleStubs(10)];
  const [curatedList, articleStubs] = await Promise.all(listRequests)

  const promos = articleStubs.data.map(PromoFactory.fromArticleStub);
  // TODO: Remove this, make it automatic
  const latestTweets = ctx.intervalCache.get('tweets');

  ctx.render('pages/curated-lists', {
    pageConfig: createPageConfig({
      title: 'Articles',
      inSection: 'explore',
      category: 'list'
    }),
    promos,
    curatedList,
    collectorsPromo, // TODO: Remove this, make it automatic
    latestTweets
  });

  return next();
}
