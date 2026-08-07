import { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';

import {
  archiveCollectionWork,
  workBasic,
} from '@weco/cardigan/stories/data/work';
import WorksSearchResults from '@weco/content/views/components/WorksSearchResults';

type StoryProps = ComponentProps<typeof WorksSearchResults> & {
  isArchive: boolean;
  isCollectionRoot: boolean;
};

const meta: Meta<StoryProps> = {
  title: 'Components/WorksSearchResults',
  component: WorksSearchResults,
  args: {
    works: [workBasic],
    isArchive: false,
    isCollectionRoot: false,
  },
  argTypes: {
    works: { table: { disable: true } },
    isArchive: {
      name: 'Is archive',
      control: 'boolean',
    },
    isCollectionRoot: {
      name: 'Is collection root',
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Basic: Story = {
  name: 'WorksSearchResults',
  render: args => {
    if (args.isArchive) {
      args.works = [
        {
          ...archiveCollectionWork,
          collection: {
            ...archiveCollectionWork.collection!,
            isRoot: args.isCollectionRoot,
          },
        },
      ];
    }

    return <WorksSearchResults {...args} />;
  },
};
