import TextAndImageOrIcons from '@weco/content/components/TextAndImageOrIcons';
import Readme from '@weco/content/components/TextAndImageOrIcons/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { smallText } from '@weco/cardigan/stories/data/text';
import { mockIcons } from '@weco/common/test/fixtures/components/text-and-icons';
import { image as genericImage } from '@weco/cardigan/stories/data/images';

const Template = args => (
  <ReadmeDecorator
    WrappedComponent={TextAndImageOrIcons}
    args={args}
    Readme={Readme}
  />
);

export const icons = Template.bind({});
icons.args = {
  item: {
    type: 'icons',
    icons: mockIcons,
    text: smallText(),
  },
};
icons.storyName = 'TextAndIcons';

export const image = Template.bind({});
image.args = {
  item: {
    type: 'image',
    image: genericImage(),
    isZoomable: true,
    text: smallText(),
  },
};
image.storyName = 'TextAndImage';
