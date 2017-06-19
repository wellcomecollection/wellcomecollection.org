import { promo, variants as promoVariants } from '../components/promo/index.config';
import { numberedList } from '../components/numbered-list/index.config';

export const name = 'explore';
export const handle = 'explore-template';

const seriesArticlePromo = promoVariants.find(v => v.name === 'series-article').context.promo;
const standaloneArticlePromo = promoVariants.find(v => v.name === 'standalone').context.promo;
const comicPromo = promoVariants.find(v => v.name === 'comic').context.promo;

export const context = {
  promo,
  seriesArticlePromo,
  standaloneArticlePromo,
  comicPromo,
  numberedList
};
