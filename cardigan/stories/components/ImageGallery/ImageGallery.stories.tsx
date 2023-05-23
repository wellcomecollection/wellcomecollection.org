import ImageGallery from '@weco/content/components/ImageGallery/ImageGallery';
import { captionedImage } from '@weco/cardigan/stories/content';
import Readme from '@weco/content/components/ImageGallery/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';

const images = [...new Array(5)].map(() => captionedImage());
const sharedArgs = {
  items: images,
  id: 'test',
  isStandalone: false,
};
const sharedParams = { chromatic: { viewports: [375, 1200] } };

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
inline.parameters = sharedParams;

export const standalone = Template.bind({});
standalone.args = {
  ...sharedArgs,
  isStandalone: true,
};
standalone.parameters = sharedParams;

export const frames = Template.bind({});
frames.args = {
  ...sharedArgs,
  isFrames: true,
};
frames.parameters = sharedParams;
