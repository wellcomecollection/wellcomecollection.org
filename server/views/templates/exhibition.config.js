import {createPageConfig} from '../../model/page-config';
import {getExhibition} from '../../services/prismic';

export const name = 'exhibition';
export const handle = 'exhibition-template';

export const context = {
  pageConfig: createPageConfig({inSection: 'whatson', path: '/cardigan/exhibition'}),
  exhibitionContent: getExhibition('WZwh4ioAAJ3usf86'),
  tags: {
    id: 'cardigan-exhibition',
    tags: [{
      text: 'Exhibition',
      url: '#'
    },
    {
      prefix: 'Part of:',
      text: 'A Museum of Modern Nature',
      url: '/components/preview/exhibition-template.html'
    }]
  },
  video: {
    embedUrl: `https://www.youtube.com/embed/gyZBueN3ArU?version=3&rel=1&fs=1&autohide=2&showsearch=0&showinfo=1&iv_load_policy=1&wmode=transparent`
  }
};
