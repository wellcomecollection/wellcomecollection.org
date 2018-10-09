// @flow
import title from './parts/title';
import list from './parts/list';
import link from './parts/link';
import number from './parts/number';
import promo from './parts/promo';
import contributorsWithTitle from './parts/contributorsWithTitle';

export default {
  Webcomic: {
    title,
    image: {
      type: 'Image',
      config: {
        label: 'Webcomic'
      }
    }
  },
  Contributors: contributorsWithTitle(),
  Series: {
    series: list('Series', {
      series: link('Series', 'document', ['series']),
      positionInSeries: number('Position in series')
    })
  },
  Promo: {
    promo
  },
  Deprecated: {
    publishDate: {
      config: {
        label: 'Override publish date'
      },
      type: 'Timestamp'
    }
  }
};
