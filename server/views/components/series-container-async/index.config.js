import { getArticleStubs } from '../../../services/wordpress';
import { PromoListFactory } from '../../../model/promo-list';

export const name = 'series-container';
export const handle = 'series-container';
export const status = 'graduated';

async function getSeries() {
  const allStubs = await getArticleStubs(100);
  const aDropInTheOceanStubs = allStubs.data.filter(stub => stub.headline.indexOf('A drop in the ocean:') === 0).take(7);

  return {
    url: '/series/a-drop-in-the-ocean',
    name: 'A drop in the ocean',
    items: aDropInTheOceanStubs,
    description: 'This series showcases many different voices and perspectives from people with\
                  lived experience of mental ill health and explores their ideas of personal asylum\
                  through sculpture, vlogging, poetry and more.'
  };
}

const aDropInTheOcean = getSeries().then((data) => {
  return PromoListFactory.fromSeries(data);
});

export const context = {
  model: aDropInTheOcean
};
