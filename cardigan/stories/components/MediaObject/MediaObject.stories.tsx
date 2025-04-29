import { RichTextField } from '@prismicio/client';
import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { imageWithCrops } from '@weco/cardigan/stories/data/images';
import { mockData } from '@weco/common/test/fixtures/components/media-object';
import { MediaObject } from '@weco/content/components/MediaObject';
import Readme from '@weco/content/components/MediaObject/README.mdx';

const meta: Meta<typeof MediaObject> = {
  title: 'Components/MediaObject',
  component: MediaObject,
  args: {
    title: mockData.title,
    text: mockData.text as RichTextField,
    image: imageWithCrops,
  },
};

export default meta;

type Story = StoryObj<typeof MediaObject>;

export const Basic: Story = {
  name: 'MediaObject',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={MediaObject}
      args={args}
      Readme={Readme}
    />
  ),
};
