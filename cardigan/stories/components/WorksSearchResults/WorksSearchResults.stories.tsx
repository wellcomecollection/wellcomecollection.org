import { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';

import {
  archiveCollectionWork,
  nonArchiveCollectionWork,
  workBasic,
} from '@weco/cardigan/stories/data/work';
import { ServerDataContext } from '@weco/common/server-data/Context';
import { defaultServerData } from '@weco/common/server-data/types';
import type { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import WorksSearchResults from '@weco/content/views/components/WorksSearchResults';

const workVariants = {
  ordinary: {
    label: 'An ordinary work',
    work: workBasic,
  },
  collectionRootManuscript: {
    label: 'A collection root that is a manuscript',
    work: nonArchiveCollectionWork,
  },
  archiveCollectionRoot: {
    label: 'An archive collection root',
    work: archiveCollectionWork,
  },
} satisfies Record<string, { label: string; work: WorkBasic }>;

type WorkVariant = keyof typeof workVariants;

type StoryProps = ComponentProps<typeof WorksSearchResults> & {
  workVariant: WorkVariant;
};

const meta: Meta<StoryProps> = {
  title: 'Components/WorksSearchResults',
  component: WorksSearchResults,
  args: {
    works: [workBasic],
    workVariant: 'ordinary',
  },
  argTypes: {
    works: { table: { disable: true } },
    workVariant: {
      name: 'Work',
      control: {
        type: 'radio',
        labels: Object.fromEntries(
          Object.entries(workVariants).map(([id, { label }]) => [id, label])
        ),
      },
      options: Object.keys(workVariants) as WorkVariant[],
      description:
        'Only an archive collection root gets the "Archive Collection" treatment. A collection root that is a manuscript does not.',
    },
  },
  // TODO remove once archiveCollection is fully rolled out
  decorators: [
    Story => (
      <ServerDataContext.Provider
        value={{
          ...defaultServerData,
          toggles: {
            ...defaultServerData.toggles,
            featureFlags: {
              ...defaultServerData.toggles.featureFlags,
              archiveCollection: true,
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
  render: ({ workVariant }) => (
    <>
      <WorksSearchResults works={[workVariants[workVariant].work]} />

      {workVariant === 'archiveCollectionRoot' && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#b8b8b8',
            marginTop: '1rem',
          }}
        >
          This is currently behind the <code>archiveCollection</code> feature
          flag
        </div>
      )}
    </>
  ),
};
