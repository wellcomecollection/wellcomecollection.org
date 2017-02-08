import { promo, variants as promoVariants } from '../components/promo/index.config';
import { numberedList } from '../components/numbered-list/index.config';

export const name = 'Explore Landing';
export const handle = 'explore-landing-template';

const seriesArticlePromo = promoVariants.find(v => v.name === 'series-article').context.promo;
const standaloneArticlePromo = promoVariants.find(v => v.name === 'standalone').context.promo;

console.info(standaloneArticlePromo)

export const context = {
  promo,
  seriesArticlePromo,
  standaloneArticlePromo,
  numberedList
};
