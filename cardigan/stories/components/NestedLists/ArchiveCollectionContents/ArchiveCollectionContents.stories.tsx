import { Meta, StoryObj } from '@storybook/react';

import collectionTree, {
  collectionResults,
} from '@weco/cardigan/stories/data/collection-tree';
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
  // isActive triggers the component's own fetch to the real Catalogue API
  // (getArchiveCollectionContents). Stub it with fixture data instead, so
  // the story - and its Chromatic snapshot - don't depend on live prod
  // data. Runs before the story renders, so it's in place before the
  // component's effect fires.
  loaders: [
    async () => {
      window.fetch = async () =>
        new Response(
          JSON.stringify({
            type: 'ResultList',
            results: collectionResults,
            totalPages: 1,
            totalResults: collectionResults.length,
            pageSize: collectionResults.length,
          })
        );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof ArchiveCollectionContents>;

export const Basic: Story = {
  name: 'ArchiveCollectionContents',
};
