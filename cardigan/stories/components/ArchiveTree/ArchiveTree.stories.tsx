import { Meta, StoryObj } from '@storybook/react';

import collectionTree from '@weco/cardigan/stories/data/collection-tree';
import ArchiveTree from '@weco/content/components/ArchiveTree';
import IsArchiveContext from '@weco/content/components/IsArchiveContext';

const meta: Meta<typeof ArchiveTree> = {
  title: 'Components/ArchiveTree',
  component: ArchiveTree,
  args: {
    work: collectionTree,
  },
  parameters: {
    disableSnapshot: true,
  },
};

export default meta;

type Story = StoryObj<typeof ArchiveTree>;

const Template = args => (
  <IsArchiveContext.Provider value={true}>
    <ArchiveTree {...args} />
  </IsArchiveContext.Provider>
);

export const Basic: Story = {
  name: 'ArchiveTree',
  render: Template,
};
