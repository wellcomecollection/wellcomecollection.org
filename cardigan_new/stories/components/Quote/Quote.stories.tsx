import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan_new/config/decorators';
import { quote } from '@weco/cardigan_new/stories/data/content';
import Quote from '@weco/content/components/Quote/Quote';
import Readme from '@weco/content/components/Quote/README.mdx';

const meta: Meta<typeof Quote> = {
  title: 'Components/Quote',
  component: Quote,
  args: {
    ...quote,
  },
  argTypes: {
    isPullOrReview: {
      control: 'boolean',
      name: 'Is either a pull quote or a review',
    },
    text: {
      table: {
        disable: true,
      },
    },
    citation: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Quote>;

export const Basic: Story = {
  name: 'Quote',
  render: args => (
    <ReadmeDecorator WrappedComponent={Quote} args={args} Readme={Readme} />
  ),
};
