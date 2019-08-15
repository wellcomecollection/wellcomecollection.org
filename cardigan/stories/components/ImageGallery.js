import { storiesOf } from '@storybook/react';
import ImageGallery from '../../../common/views/components/ImageGallery/ImageGallery';
import { captionedImage } from '../content';
import Readme from '../../../common/views/components/ImageGallery/README.md';
import { boolean } from '@storybook/addon-knobs/react';

const ImageGalleryExample = () => {
  const images = [...new Array(5)].map(i => captionedImage());
  return (
    <ImageGallery
      items={images}
      id="cardy"
      isStandalone={boolean('Is standalone?', false)}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('ImageGallery', ImageGalleryExample, {
  readme: { sidebar: Readme },
  isFullScreen: true,
});
