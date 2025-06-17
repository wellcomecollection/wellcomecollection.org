import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import StatusIndicator from '@weco/content/components/StatusIndicator';
import Readme from '@weco/content/components/StatusIndicator/README.mdx';

const now = new Date();
const tomorrow = new Date();
tomorrow.setHours(now.getHours() + 24);

const threeDaysFromNow = new Date();
threeDaysFromNow.setHours(now.getHours() + 72);

const twoWeeksFromNow = new Date();
twoWeeksFromNow.setHours(now.getHours() + 336);

const twoWeeksAgo = new Date();
twoWeeksAgo.setHours(now.getHours() - 336);

const aWeekAgo = new Date();
aWeekAgo.setHours(now.getHours() - 168);

const meta: Meta<typeof StatusIndicator> = {
  title: 'Components/StatusIndicator',
  component: StatusIndicator,
  render: args => (
    <ReadmeDecorator
      WrappedComponent={StatusIndicator}
      args={args}
      Readme={Readme}
    />
  ),
};

export default meta;

type Story = StoryObj<typeof StatusIndicator>;

export const ComingSoon: Story = {
  name: 'Coming soon',
  args: {
    start: tomorrow,
    end: twoWeeksFromNow,
  },
};

export const Past: Story = {
  name: 'Past',
  args: {
    start: twoWeeksAgo,
    end: aWeekAgo,
  },
};

export const FinalWeek: Story = {
  name: 'Final week',
  args: {
    start: now,
    end: threeDaysFromNow,
  },
};

export const NowOn: Story = {
  name: 'Now on',
  args: {
    start: now,
    end: twoWeeksFromNow,
  },
};
