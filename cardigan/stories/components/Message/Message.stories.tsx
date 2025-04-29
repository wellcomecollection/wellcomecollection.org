import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import Message from '@weco/content/components/Message';
import Readme from '@weco/content/components/Message/README.mdx';

const meta: Meta<typeof Message> = {
  title: 'Components/Message',
  component: Message,
  args: {
    text: 'Just turn up',
  },
};

export default meta;

type Story = StoryObj<typeof Message>;

export const Basic: Story = {
  name: 'Message',
  render: args => (
    <ReadmeDecorator WrappedComponent={Message} args={args} Readme={Readme} />
  ),
};
