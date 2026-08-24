import { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';

import {
  archiveCollectionWork,
  nonArchiveCollectionWork,
  workBasic,
} from '@weco/cardigan/stories/data/work';
import { ServerDataContext } from '@weco/common/server-data/Context';
import { defaultServerData } from '@weco/common/server-data/types';
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
  // TODO remove once archiveBrowsing is fully rolled out
  decorators: [
    Story => (
      <ServerDataContext.Provider
        value={{
          ...defaultServerData,
          toggles: {
            ...defaultServerData.toggles,
            featureFlags: {
              ...defaultServerData.toggles.featureFlags,
              archiveBrowsing: true,
            },
          },
        }}
      >
        <Story />
      </ServerDataContext.Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Basic: Story = {
  name: 'WorksSearchResults',
  render: ({ isArchive, isRootCollection, works }) => {
    const resolvedWorks = isArchive
      ? [{ ...archiveCollectionWork, isRootCollection }]
      : [isRootCollection ? nonArchiveCollectionWork : works[0]];

    return (
      <>
        <WorksSearchResults works={resolvedWorks} />

        {isRootCollection && isArchive && (
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#b8b8b8',
              marginTop: '1rem',
            }}
          >
            This is currently behind the <code>archiveBrowsing</code> feature
            flag
          </div>
        )}
      </>
    );
  },
};
