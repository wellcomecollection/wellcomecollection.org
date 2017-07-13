import {getCuratedList} from '../services/prismic-curated-lists';
import {getEditorialList} from '../services/prismic-content';
import {getArticleStubs} from '../services/wordpress';
import {PromoFactory} from '../model/promo';
import {createPageConfig} from '../model/page-config';
import {collectorsPromo} from '../data/series';
import {isFlagEnabled} from '../util/flag-status';

export async function explore(ctx, next) {
  // TODO: Remove WP content
  const [flags] = ctx.intervalCache.get('flags');
  const prismicArticlesOnExploreFlag = isFlagEnabled(ctx.featuresCohort, 'prismicArticlesOnExplore', flags);
  const contentListPromise = prismicArticlesOnExploreFlag ? getEditorialList() : Promise.resolve([]);

  const listRequests = [getCuratedList('explore'), getArticleStubs(10), contentListPromise];
  const [curatedList, articleStubs, contentList] = await Promise.all(listRequests);

  const wpPromos = articleStubs.data.map(PromoFactory.fromArticleStub);
  const contentPromos = contentList.map(PromoFactory.fromArticleStub);
  const promos = wpPromos.concat(contentPromos).sort((a, b) => {
    return a.datePublished.getTime() - b.datePublished.getTime();
  })
  .reverse()
  .map((promo, index) => {
    if (index === 0) {
      return Object.assign({}, promo, {weight: 'lead'});
    } else {
      return promo;
    }
  });

  // TODO: Remove this, make it automatic
  const latestTweets = ctx.intervalCache.get('tweets');

  ctx.render('pages/curated-lists', {
    pageConfig: createPageConfig({
      title: 'Explore',
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
