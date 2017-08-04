import {createPageConfig} from '../../model/page-config';
import {getExhibition} from '../../services/exhibitions';
import {getEvent} from '../../services/events';
import {getArticleStubs} from '../../services/wordpress';
import {PromoFactory} from '../../model/promo';

async function getFourArticlePromos() {
  const fourArticlePromos = await getArticleStubs(4);
  return fourArticlePromos.data.map(item => {
    return PromoFactory.fromArticleStub(item);
  }).toJS();
}

export const name = 'exhibition';
export const handle = 'exhibition-template';

export const context = {
  pageConfig: createPageConfig({inSection: 'whatson'}),
  event: getEvent('WXmdTioAAJWWjZdH'),
  exhibition: getExhibition('WYH6Px8AAH9Ic4Mf'),
  articlePromos: getFourArticlePromos(),
  tags: [
    {
      text: 'Exhibition',
      url: '#'
    },
    {
      prefix: 'Part of:',
      text: 'A Museum of Modern Nature',
      url: '/components/preview/exhibition-template.html',
      bgColor: 'teal'
    }
  ],
  video: {
    embedUrl: `https://www.youtube.com/embed/gyZBueN3ArU?version=3&rel=1&fs=1&autohide=2&showsearch=0&showinfo=1&iv_load_policy=1&wmode=transparent`
  }
};
