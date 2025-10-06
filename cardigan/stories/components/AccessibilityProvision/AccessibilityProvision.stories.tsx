import { Meta, StoryObj } from '@storybook/react';

import AccessibilityProvision from '@weco/common/views/components/AccessibilityProvision';

const meta: Meta<typeof AccessibilityProvision> = {
  title: 'Components/AccessibilityProvision',
  component: AccessibilityProvision,
  args: {
    showText: true,
  },
  argTypes: {
    showText: { control: 'boolean', name: 'Show text' },
  },
};

export default meta;

type Story = StoryObj<typeof AccessibilityProvision>;

export const Basic: Story = {
  name: 'AccessibilityProvision',
  render: args => <AccessibilityProvision {...args} />,
};
