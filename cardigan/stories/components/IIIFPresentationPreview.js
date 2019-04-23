import { storiesOf } from '@storybook/react';
import IIIFPresentationPreview from '../../../common/views/components/IIIFPresentationPreview/IIIFPresentationPreview';
import Readme from '../../../common/views/components/IIIFPresentationPreview/README.md';

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
  return (
    <IIIFPresentationPreview
      iiifPresentationLocation={iiifPresentationLocation}
      itemUrl={itemUrl}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('IIIFPresentationPreview', IIIFPresentationPreviewExample, {
  info: Readme,
});
