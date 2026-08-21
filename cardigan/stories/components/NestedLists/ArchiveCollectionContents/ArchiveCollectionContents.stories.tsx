import { Meta, StoryObj } from '@storybook/react';

import collectionTree, {
  collectionResults,
  collectionResultsPage2,
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
  //
  // Two fake pages (rather than one), so the "Show more" row shows up and
  // can be exercised without needing 50 real fixture rows.
  loaders: [
    async () => {
      const totalResults =
        collectionResults.length + collectionResultsPage2.length;
      window.fetch = async input => {
        const { searchParams } = new URL(String(input));
        const page = Number(searchParams.get('page')) || 1;
        return new Response(
          JSON.stringify({
            type: 'ResultList',
            results: page === 1 ? collectionResults : collectionResultsPage2,
            totalPages: 2,
            totalResults,
            pageSize: collectionResults.length,
          })
        );
      };
    },
  ],
};

export default meta;

type Story = StoryObj<typeof ArchiveCollectionContents>;

export const Basic: Story = {
  name: 'ArchiveCollectionContents',
};
