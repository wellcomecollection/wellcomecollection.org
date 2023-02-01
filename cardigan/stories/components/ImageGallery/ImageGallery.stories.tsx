import ImageGallery from '@weco/content/components/ImageGallery/ImageGallery';
import { captionedImage } from '@weco/cardigan/stories/content';
import Readme from '@weco/content/components/ImageGallery/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';

const images = [...new Array(5)].map(() => captionedImage());

const Template = args => (
  <ReadmeDecorator
    WrappedComponent={ImageGallery}
    args={args}
    Readme={Readme}
  />
);
export const inline = Template.bind({});
inline.args = {
  items: images,
  id: 'test',
  isStandalone: false,
};

export const standalone = Template.bind({});
standalone.args = {
  items: images,
  id: 'test',
  isStandalone: true,
};

export const frames = Template.bind({});
frames.args = {
  items: images,
  id: 'test',
  isFrames: true,
};
