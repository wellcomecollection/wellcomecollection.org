import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { sampleTree } from '@weco/cardigan/stories/data/collection-tree';
import { treeInstructions } from '@weco/common/data/microcopy';
import WorkItem from '@weco/content/views/pages/works/work/ArchiveTree/ArchiveTree.WorkItemRenderer';
import NestedList from '@weco/content/views/pages/works/work/NestedList';
import {
  Tree,
  TreeInstructions,
} from '@weco/content/views/pages/works/work/work.styles';
import { UiTree } from '@weco/content/views/pages/works/work/work.types';

const meta: Meta<typeof NestedList> = {
  title: 'Components/NestedLists/NestedList',
  component: NestedList,
  args: {
    showFirstLevelGuideline: false,
    shouldFetchChildren: false,
    firstItemTabbable: true,
    isDarkMode: false,
  },
  argTypes: {
    items: { table: { disable: true } },
    tree: { table: { disable: true } },
    setTree: { table: { disable: true } },
    tabbableId: { table: { disable: true } },
    setTabbableId: { table: { disable: true } },
    ItemRenderer: { table: { disable: true } },
    workAncestors: { table: { disable: true } },
    itemRendererProps: { table: { disable: true } },
    currentWorkId: { table: { disable: true } },
    level: { table: { disable: true } },
    shouldFetchChildren: { table: { disable: true } },
    firstItemTabbable: { table: { disable: true } },
    isDarkMode: { type: 'boolean' },
    isCompact: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof NestedList>;

export const Basic: Story = {
  name: 'NestedList',
  args: {
    showFirstLevelGuideline: false,
    shouldFetchChildren: false,
    firstItemTabbable: true,
  },
  render: function Render(args) {
    const [tree, setTree] = useState<UiTree>(sampleTree);
    const [tabbableId, setTabbableId] = useState<string>();

    return (
      <Tree $isEnhanced>
        <TreeInstructions>{treeInstructions}</TreeInstructions>
        <NestedList
          {...args}
          currentWorkId="root"
          tree={tree}
          setTree={setTree}
          items={tree}
          level={1}
          tabbableId={tabbableId}
          setTabbableId={setTabbableId}
          ItemRenderer={WorkItem}
        />
      </Tree>
    );
  },
};
