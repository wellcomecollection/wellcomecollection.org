import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import InfoBlock from '@weco/content/components/InfoBlock';
import Readme from '@weco/content/components/InfoBlock/README.mdx';

const meta: Meta<typeof InfoBlock> = {
  title: 'Components/InfoBlock',
  component: InfoBlock,
  args: {
    title: 'Book your ticket',
    text: [
      {
        type: 'list-item',
        text: 'It’s still free to visit our museum and library. You’ll just need to choose a time slot and book a ticket before you arrive.',
        spans: [],
      },
      {
        type: 'list-item',
        text: 'You can explore the museum for as long as you’d like, but  library sessions are now limited to either a morning or an afternoon. Library tickets include museum entry too.',
        spans: [],
      },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof InfoBlock>;

export const Basic: Story = {
  name: 'InfoBlock',
  render: args => (
    <ReadmeDecorator WrappedComponent={InfoBlock} args={args} Readme={Readme} />
  ),
};
