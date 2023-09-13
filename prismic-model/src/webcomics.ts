import title from './parts/title';
import list from './parts/list';
import { documentLink } from './parts/link';
import promo from './parts/promo';
import { articleBody } from './parts/bodies';
import contributorsWithTitle from './parts/contributorsWithTitle';
import { singleLineText } from './parts/text';
import { CustomType } from './types/CustomType';

const webcomics: CustomType = {
  id: 'webcomics',
  label: 'Webcomic',
  repeatable: true,
  status: false,
  json: {
    Webcomic: {
      title,
      format: documentLink('Format', { linkedType: 'article-formats' }),
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
      metadataDescription: singleLineText('Metadata description'),
    },
    'Content relationships': {
      series: list('Series', {
        series: documentLink('Series', { linkedType: 'webcomic-series' }),
      }),
    },
    Overrides: {
      publishDate: {
        config: {
          label:
            'Override publish date rendering. This will not affect ordering',
        },
        type: 'Timestamp',
      },
    },
  },
  format: 'custom',
};

export default webcomics;
