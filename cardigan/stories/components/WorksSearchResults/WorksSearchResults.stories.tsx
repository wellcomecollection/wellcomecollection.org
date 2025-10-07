import { Meta, StoryObj } from '@storybook/react';

import { workBasic } from '@weco/cardigan/stories/data/work';
import WorksSearchResults from '@weco/content/views/components/WorksSearchResults';

const meta: Meta<typeof WorksSearchResults> = {
  title: 'Components/WorksSearchResults',
  component: WorksSearchResults,
  args: {
    works: [workBasic],
  },
  argTypes: {
    works: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof WorksSearchResults>;

export const Basic: Story = {
  name: 'WorksSearchResults',
  render: args => <WorksSearchResults {...args} />,
};
