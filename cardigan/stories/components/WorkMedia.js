import { storiesOf } from '@storybook/react';
import WorkMedia from '../../../common/views/components/WorkMedia/WorkMedia';
import Readme from '../../../common/views/components/WorkMedia/README.md';

const WorkMediaExample = () => {
  return (
    <WorkMedia
      id={`z2dxwfjw`}
      iiifUrl={`https://iiif.wellcomecollection.org/image/V0021294.jpg/info.json`}
      title={`Four different species of cats, including the angora cat and the domestic cat. Coloured etching by J. D. E. Canu and L. F. Couché after Vauthier.`}
      width={800}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('WorkMedia', WorkMediaExample, {info: Readme});
