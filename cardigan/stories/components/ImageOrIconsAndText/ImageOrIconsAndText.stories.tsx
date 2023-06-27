import ImageOrIconsAndText from '@weco/content/components/ImageOrIconsAndText/ImageOrIconsAndText';
import Readme from '@weco/content/components/ImageOrIconsAndText/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { mockImage } from '@weco/common/test/fixtures/components/compact-card';
import { smallText } from '../../content';

const Template = args => (
  <ReadmeDecorator
    WrappedComponent={ImageOrIconsAndText}
    args={args}
    Readme={Readme}
  />
);

export const icons = Template.bind({});
icons.args = {
  items: [
    {
      type: 'icons',
      icons: ['a11YVisual', 'a11Y', 'audioDescribed', 'lifts'],
      text: smallText(),
    },
    {
      type: 'icons',
      icons: ['a11Y', 'lifts'],
      text: smallText(),
    },
  ],
};
icons.storyName = 'IconsAndText';

export const image = Template.bind({});
image.args = {
  items: [
    {
      type: 'image',
      image: mockImage,
      text: smallText(),
    },
  ],
};
image.storyName = 'ImageAndText';
