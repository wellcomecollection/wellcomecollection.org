// This has been deprecated and we should be using the article format of comic
// and general article series.
import title from './parts/title';
import { multiLineText, singleLineText } from './parts/structured-text';
import promo from './parts/promo';
import contributorsWithTitle from './parts/contributorsWithTitle';
import { CustomType } from './types/CustomType';

const webcomicSeries: CustomType = {
  id: 'webcomic-series',
  label: '[Deprecated] Webcomic series',
  repeatable: true,
  status: false,
  json: {
    '[Deprecated] Webcomic series': {
      title: title,
      description: multiLineText({ label: 'Description' }),
    },
    Contributors: contributorsWithTitle(),
    Promo: {
      promo,
    },
    Metadata: {
      metadataDescription: singleLineText({ label: 'Metadata description' }),
    },
  },
};

export default webcomicSeries;
