import { Meta, StoryObj } from '@storybook/react';

import { venues } from '@weco/common/test/fixtures/components/venues';
import OpeningTimes from '@weco/common/views/components/OpeningTimes';

const meta: Meta<typeof OpeningTimes> = {
  title: 'Components/OpeningTimes',
  component: OpeningTimes,
  args: {
    venues,
  },
  argTypes: {
    venues: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof OpeningTimes>;

export const Basic: Story = {
  name: 'OpeningTimes',
  render: args => <OpeningTimes {...args} />,
};
