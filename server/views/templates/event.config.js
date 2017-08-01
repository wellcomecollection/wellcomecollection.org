import {getEvent} from '../../services/events';

export const name = 'event';
export const handle = 'event-template';

export const context = {
  event: getEvent('WXmdTioAAJWWjZdH'),
  tags: '@tags.model',
  video: {
    embedUrl: `https://www.youtube.com/embed/Vadnb7fTbEY?version=3&rel=1&fs=1&autohide=2&showsearch=0&showinfo=1&iv_load_policy=1&wmode=transparent`
  }
};
