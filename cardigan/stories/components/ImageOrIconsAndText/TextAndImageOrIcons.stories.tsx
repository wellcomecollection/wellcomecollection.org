import TextAndImageOrIcons from '@weco/content/components/TextAndImageOrIcons/TextAndImageOrIcons';
import Readme from '@weco/content/components/TextAndImageOrIcons/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { mockImage } from '@weco/common/test/fixtures/components/compact-card';
import { smallText } from '../../content';
import { mockIcons } from '@weco/common/test/fixtures/components/text-and-icons';

const Template = args => (
  <ReadmeDecorator
    WrappedComponent={TextAndImageOrIcons}
    args={args}
    Readme={Readme}
  />
);

export const icons = Template.bind({});
icons.args = {
  items: [
    {
      type: 'icons',
      icons: mockIcons,
      text: smallText(),
    },
    {
      type: 'icons',
      icons: mockIcons.slice(2, 4),
      text: smallText(),
    },
  ],
};
icons.storyName = 'TextAndIcons';

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
image.storyName = 'TextAndImage';
