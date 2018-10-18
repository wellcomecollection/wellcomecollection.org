import { storiesOf } from '@storybook/react';
import { CaptionedImage } from '../../../common/views/components/Images/Images';
import { captionedImage } from '../content';
import Readme from '../../../common/views/components/Images/README.md';

const CaptionedImageExample = () => {
  return <CaptionedImage {...captionedImage()} />;
};

const stories = storiesOf('Components', module);
stories
  .add('Captioned image', CaptionedImageExample, {info: Readme});
