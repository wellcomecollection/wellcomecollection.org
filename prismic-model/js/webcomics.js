// @flow
import title from './parts/title';
import list from './parts/list';
import link from './parts/link';
import promo from './parts/promo';
import body from './parts/body';
import contributorsWithTitle from './parts/contributorsWithTitle';
import structuredText from './parts/structured-text';

export default {
  Webcomic: {
    title,
    image: {
      type: 'Image',
      config: {
        label: 'Webcomic'
      }
    },
    body
  },
  Series: {
    series: list('Series', {
      series: link('Series', 'document', ['webcomic-series'])
    })
  },
  Contributors: contributorsWithTitle(),
  Promo: {
    promo
  },
  Metadata: {
    metadataDescription: structuredText('Metadata description', 'single')
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
