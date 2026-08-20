import { Meta, StoryObj } from '@storybook/react';

import collectionTree from '@weco/cardigan/stories/data/collection-tree';
import ArchiveCollectionContents from '@weco/content/views/pages/works/work/ArchiveCollection/ArchiveCollection.Contents';

const meta: Meta<typeof ArchiveCollectionContents> = {
  title: 'Components/NestedLists/ArchiveCollectionContents',
  component: ArchiveCollectionContents,
  args: {
    work: collectionTree,
    isActive: true,
  },
  argTypes: {
    work: { table: { disable: true } },
    isActive: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof ArchiveCollectionContents>;

export const Basic: Story = {
  name: 'ArchiveCollectionContents',
};
