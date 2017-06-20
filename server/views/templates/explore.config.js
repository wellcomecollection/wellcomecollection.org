import { promo, variants as promoVariants } from '../components/promo/index.config';
import { model as numberedList } from '../components/numbered-list/index.config';

export const name = 'explore';
export const handle = 'explore-template';
export const status = 'graduated';

const seriesArticlePromo = promoVariants.find(v => v.name === 'series-article').context.model;
const standaloneArticlePromo = promoVariants.find(v => v.name === 'standalone').context.model;
const comicPromo = promoVariants.find(v => v.name === 'comic').context.model;

export const context = {
  promo,
  seriesArticlePromo,
  standaloneArticlePromo,
  comicPromo,
  numberedList
};
