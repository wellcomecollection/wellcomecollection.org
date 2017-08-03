import {createPageConfig} from '../../model/page-config';
import {getExhibition} from '../../services/exhibitions';
import {getEvent} from '../../services/events';

export const name = 'exhibition';
export const handle = 'exhibition-template';

export const context = {
  pageConfig: createPageConfig({inSection: 'whatson'}),
  event: getEvent('WXmdTioAAJWWjZdH'),
  exhibition: getExhibition('WYH6Px8AAH9Ic4Mf'),
  tags: '@tags.model',
  video: {
    embedUrl: `https://www.youtube.com/embed/Vadnb7fTbEY?version=3&rel=1&fs=1&autohide=2&showsearch=0&showinfo=1&iv_load_policy=1&wmode=transparent`
  }
};
