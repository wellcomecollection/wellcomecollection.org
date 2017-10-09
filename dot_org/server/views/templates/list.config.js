import { getArticleStubs } from '../../services/wordpress';
import { PromoListFactory } from '../../model/promo-list';
import { PaginationFactory } from '../../model/pagination';

export const name = 'list';
export const handle = 'list-template';
export const status = 'graduated';

async function getData() {
  const page = 1;
  const articleStubsResponse = await getArticleStubs(32, {page});
  const series: Series = {
    url: '/articles',
    name: 'Articles',
    items: articleStubsResponse.data,
    total: articleStubsResponse.total
  };
  const promoList = PromoListFactory.fromSeries(series);
  const pagination = PaginationFactory.fromList(promoList.items, promoList.total, parseInt(page, 10) || 1);

  return {
    promoList,
    pagination
  };
}

export const context = {
  list: getData().then(d => d.promoList),
  pagination: getData().then(d => d.pagination)
};
