import { storiesOf } from '@storybook/react';
import ImageWithWobblyBottom from '../../../common/views/components/ImageWithWobblyBottom/ImageWithWobblyBottom';
import Readme from '../../../common/views/components/ImageWithWobblyBottom/README.md';

const stories = storiesOf('Components', module);

const ImageWithWobblyBottomExample = () => {
  return (
    <ImageWithWobblyBottom />
  );
};

stories
  .add('Image with wobbly bottom', ImageWithWobblyBottomExample, {
    info: Readme
  });
