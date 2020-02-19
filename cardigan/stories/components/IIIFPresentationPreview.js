import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs/react';
import ManifestContext from '../../../common/views/components/ManifestContext/ManifestContext';
import IIIFPresentationPreview from '../../../common/views/components/IIIFPresentationPreview/IIIFPresentationPreview';
import Readme from '../../../common/views/components/IIIFPresentationPreview/README.md';
import multiManifest from '../data/iiifManifest-multi';
import bookManifest from '../data/iiifManifest-book';
import pdfManifest from '../data/iiifManifest-pdf';
import videoManifest from '../data/iiifManifest-video';
import audioManifest from '../data/iiifManifest-audio';

function getManifest(type) {
  switch (type) {
    case 'multi':
      return multiManifest;
    case 'book':
      return bookManifest;
    case 'pdf':
      return pdfManifest;
    case 'video':
      return videoManifest;
    case 'audio':
      return audioManifest;
    case 'none':
      return {};
  }
}

const itemUrl = {
  href: {
    pathname: '/item',
    query: {
      workId: 'nuc2mfqr',
      query: 'witch',
      sierraId: 'b21038107',
      workType: 'a,v',
    },
  },
  as: {
    pathname: '/works/nuc2mfqr/items',
    query: { query: 'witch', sierraId: 'b21038107', workType: 'a,v' },
  },
};

const IIIFPresentationPreviewExample = () => {
  const type = select(
    'Type of thing to preview',
    {
      Book: 'book',
      'Multi volume': 'multi',
      Video: 'video',
      Audio: 'audio',
      PDF: 'pdf',
      None: 'none',
    },
    'book'
  );
  return (
    <>
      <ManifestContext.Provider value={getManifest(type)}>
        <IIIFPresentationPreview
          itemUrl={itemUrl}
          childManifestsCount={type === 'multi' ? 3 : 0}
        />
      </ManifestContext.Provider>
    </>
  );
};

const stories = storiesOf('Components', module);
stories.add('IIIFPresentationPreview', IIIFPresentationPreviewExample, {
  readme: { sidebar: Readme },
});
