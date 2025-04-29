import { Meta, StoryObj } from '@storybook/react';

import BetaMessage from '@weco/content/components/BetaMessage';

const meta: Meta<typeof BetaMessage> = {
  title: 'Components/BetaMessage',
  component: BetaMessage,
  args: {
    message: 'We are working to make this item available online by July 2022.',
  },
};

export default meta;

type Story = StoryObj<typeof BetaMessage>;

export const Basic: Story = {
  name: 'BetaMessage',
};
