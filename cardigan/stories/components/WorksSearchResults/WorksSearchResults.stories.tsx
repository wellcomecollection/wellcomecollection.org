import { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';

import {
  archiveCollectionWork,
  workBasic,
} from '@weco/cardigan/stories/data/work';
import WorksSearchResults from '@weco/content/views/components/WorksSearchResults';

type StoryProps = ComponentProps<typeof WorksSearchResults> & {
  isArchive: boolean;
  isRootCollection: boolean;
};

const meta: Meta<StoryProps> = {
  title: 'Components/WorksSearchResults',
  component: WorksSearchResults,
  args: {
    works: [workBasic],
    isArchive: false,
    isRootCollection: false,
  },
  argTypes: {
    works: { table: { disable: true } },
    isArchive: {
      name: 'Is archive',
      control: 'boolean',
    },
    isRootCollection: {
      name: 'Is collection root',
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Basic: Story = {
  name: 'WorksSearchResults',
  render: ({ isArchive, isRootCollection, works }) => {
    const resolvedWorks = isArchive
      ? [{ ...archiveCollectionWork, isRootCollection }]
      : works;

    return <WorksSearchResults works={resolvedWorks} />;
  },
};
