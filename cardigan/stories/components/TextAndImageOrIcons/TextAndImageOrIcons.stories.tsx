import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { image as genericImage } from '@weco/cardigan/stories/data/images';
import { smallText } from '@weco/cardigan/stories/data/text';
import { mockIcons } from '@weco/common/test/fixtures/components/text-and-icons';
import TextAndImageOrIcons from '@weco/content/views/components/TextAndImageOrIcons';
import Readme from '@weco/content/views/components/TextAndImageOrIcons/README.mdx';

const meta: Meta<typeof TextAndImageOrIcons> = {
  title: 'Components/TextAndImageOrIcons',
  component: TextAndImageOrIcons,
  render: args => (
    <ReadmeDecorator
      WrappedComponent={TextAndImageOrIcons}
      args={args}
      Readme={Readme}
    />
  ),
};

export default meta;

type Story = StoryObj<typeof TextAndImageOrIcons>;

export const Icons: Story = {
  name: 'Text and icons',
  args: {
    item: {
      type: 'icons',
      icons: mockIcons,
      text: smallText(),
    },
  },
};

export const Image: Story = {
  name: 'Text and image',
  args: {
    item: {
      type: 'image',
      image: genericImage(),
      isZoomable: true,
      text: smallText(),
    },
  },
};
