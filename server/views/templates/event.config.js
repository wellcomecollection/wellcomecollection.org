import {createPageConfig} from '../../model/page-config';
import {getEvent} from '../../services/events';
import {getArticleStubs} from '../../services/wordpress';
import {PromoFactory} from '../../model/promo';

async function getFourArticlePromos() {
  const fourArticlePromos = await getArticleStubs(4);
  return fourArticlePromos.data.map(item => {
    return PromoFactory.fromArticleStub(item);
  }).toJS();
}

export const name = 'event';
export const handle = 'event-template';

export const context = {
  pageConfig: createPageConfig({inSection: 'whatson', path: '/cardigan/event'}),
  articlePromos: getFourArticlePromos(),
  event: getEvent('WXmdTioAAJWWjZdH'),
  tags: '@tags.model',
  video: {
    embedUrl: `https://www.youtube.com/embed/gyZBueN3ArU?version=3&rel=1&fs=1&autohide=2&showsearch=0&showinfo=1&iv_load_policy=1&wmode=transparent`
  },
  partners: '@organization-list.model'
};
