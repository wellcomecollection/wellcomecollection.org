import { storiesOf } from '@storybook/react';
import {select } from '@storybook/addon-knobs/react';
import ManifestContext from '../../../common/views/components/ManifestContext/ManifestContext';
import IIIFPresentationPreview from '../../../common/views/components/IIIFPresentationPreview/IIIFPresentationPreview';
import Readme from '../../../common/views/components/IIIFPresentationPreview/README.md';
import multiManifest from '../data/iiifManifest-multi';
import bookManifest from '../data/iiifManifest-book';
import pdfManifest from '../data/iiifManifest-pdf';
import videoManifest from '../data/iiifManifest-video';
import audioManifest from '../data/iiifManifest-audio';
import { getManifestViewType } from '@weco/common/utils/works';

function getManifest(type){
  switch (type) {
    case 'multi':
        return multiManifest
    case 'book':
      return bookManifest
    case 'pdf':
      return pdfManifest
    case 'video':
      return videoManifest
    case 'audio':
      return audioManifest
    case 'none':
      return {}
    case 'unknown':
      return {}
    }
}

const iiifPresentationLocation = {
  locationType: {
    id: 'iiif-presentation',
    label: 'IIIF Presentation API',
    type: 'LocationType',
  },
  url: 'https://wellcomelibrary.org/iiif/b21038107/manifest',
  type: 'DigitalLocation',
};

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
  const type = select('Type of thing to preview',
{
  'Multi volume': 'multi',
  Book: 'book',
  PDF: 'pdf',
  Video: 'video',
  Audio: 'audio',
  None: 'none',
  Unknown: 'unknown'
},
'book');
  return (<>
    <ManifestContext.Provider value={getManifest(type)}>
      <IIIFPresentationPreview
        iiifPresentationLocation={iiifPresentationLocation}
        itemUrl={itemUrl}
      />
    </ManifestContext.Provider></>
  );
};

const stories = storiesOf('Components', module);
stories.add('IIIFPresentationPreview', IIIFPresentationPreviewExample, {
  readme: { sidebar: Readme },
});
