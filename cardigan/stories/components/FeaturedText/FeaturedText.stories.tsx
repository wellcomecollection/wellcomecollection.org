import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import FeaturedText from '@weco/content/components/FeaturedText';
import Readme from '@weco/content/components/FeaturedText/README.mdx';

const meta: Meta<typeof FeaturedText> = {
  title: 'Components/FeaturedText',
  component: FeaturedText,
  args: {
    html: [
      {
        type: 'paragraph',
        text: 'Walk inside an innovative mobile clinic, and follow its development from the early prototypes to the first complete version.',
        spans: [],
      },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof FeaturedText>;

export const Basic: Story = {
  name: 'FeaturedText',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={FeaturedText}
      args={args}
      Readme={Readme}
    />
  ),
};
