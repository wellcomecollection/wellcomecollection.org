import title from './parts/title';
import list from './parts/list';
import link from './parts/link';
import promo from './parts/promo';
import articleBody from './parts/article-body';
import contributorsWithTitle from './parts/contributorsWithTitle';
import structuredText from './parts/structured-text';
import { CustomType } from './types/CustomType';

const webcomics: CustomType = {
  id: 'webcomics',
  label: 'Webcomic',
  repeatable: true,
  status: false,
  json: {
    Webcomic: {
      title,
      format: link('Format', 'document', ['article-formats']),
      image: {
        type: 'Image',
        config: {
          label: 'Webcomic',
        },
      },
      body: articleBody,
    },
    Contributors: contributorsWithTitle(),
    Promo: {
      promo,
    },
    Metadata: {
      metadataDescription: structuredText('Metadata description', 'single'),
    },
    'Content relationships': {
      series: list('Series', {
        series: link('Series', 'document', ['webcomic-series']),
      }),
    },
    Deprecated: {
      publishDate: {
        config: {
          label: 'Override publish date',
        },
        type: 'Timestamp',
      },
    },
  },
};

export default webcomics;
