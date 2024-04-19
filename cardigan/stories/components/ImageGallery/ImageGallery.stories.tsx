import ImageGallery from '@weco/content/components/ImageGallery';
import Readme from '@weco/content/components/ImageGallery/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { captionedImage } from '@weco/cardigan/stories/data/images';

const images = [...new Array(5)].map(() => captionedImage());
const sharedArgs = {
  items: images,
  id: 'test',
  isStandalone: false,
};

const Template = args => (
  <ReadmeDecorator
    WrappedComponent={ImageGallery}
    args={args}
    Readme={Readme}
  />
);
export const inline = Template.bind({});
inline.args = {
  ...sharedArgs,
  isStandalone: false,
};

export const standalone = Template.bind({});
standalone.args = {
  ...sharedArgs,
  isStandalone: true,
};

export const frames = Template.bind({});
frames.args = {
  ...sharedArgs,
  isFrames: true,
};
frames.parameters = {
  chromatic: { diffThreshold: 0.2, delay: 1000 },
};
