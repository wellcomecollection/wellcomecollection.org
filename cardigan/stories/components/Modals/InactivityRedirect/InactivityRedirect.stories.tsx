import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import InactivityRedirect from '@weco/common/views/components/InactivityRedirect';

type StoryProps = ComponentProps<typeof InactivityRedirect>;

const CountdownPreview = () => {
  return (
    <div>
      <InactivityRedirect isCardiganStory={true} />
    </div>
  );
};

const meta: Meta<StoryProps> = {
  title: 'Components/Modals/InactivityRedirect',
  component: InactivityRedirect,
  argTypes: {
    isCardiganStory: { table: { disable: true } },
  },
  render: () => <CountdownPreview />,
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Default: Story = { name: 'InactivityRedirect' };
