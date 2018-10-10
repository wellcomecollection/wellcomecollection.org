// @flow
import title from './parts/title';
import structuredText from './parts/structured-text';
import promo from './parts/promo';
import contributorsWithTitle from './parts/contributorsWithTitle';

export default {
  '[Deprecated] Webcomic series': {
    title: title,
    description: structuredText('Description')
  },
  Contributors: contributorsWithTitle(),
  Promo: {
    promo
  }
};
