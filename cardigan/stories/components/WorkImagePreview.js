import { storiesOf } from '@storybook/react';
import WorkImagePreview from '../../../common/views/components/WorkImagePreview/WorkImagePreview';
import Readme from '../../../common/views/components/WorkImagePreview/README.md';

const WorkImagePreviewExample = () => {
  return (
    <WorkImagePreview
      id={`z2dxwfjw`}
      iiifUrl={`https://iiif.wellcomecollection.org/image/V0021294.jpg/info.json`}
      title={`Four different species of cats, including the angora cat and the domestic cat. Coloured etching by J. D. E. Canu and L. F. Couché after Vauthier.`}
      width={800}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('WorkImagePreview', WorkImagePreviewExample, { info: Readme });
