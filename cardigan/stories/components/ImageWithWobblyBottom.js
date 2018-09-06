import { storiesOf } from '@storybook/react';
import ImageWithWobblyBottom from '../../../common/views/components/ImageWithWobblyBottom/ImageWithWobblyBottom';
import Readme from '../../../common/views/components/ImageWithWobblyBottom/README.md';
import {image} from '../content';

const stories = storiesOf('Components', module);
const ImageWithWobblyBottomExample = () => {
  return (
    <ImageWithWobblyBottom image={image()} />
  );
};

stories
  .add('Image with wobbly bottom', ImageWithWobblyBottomExample, {
    info: Readme
  });
