import ArchiveTree from '@weco/content/components/ArchiveTree';
import collectionTree from '@weco/cardigan/stories/data/collection-tree';

const Template = args => <ArchiveTree {...args} />;

// TODO fix snapshots
export const basic = Template.bind({});
basic.args = {
  work: collectionTree,
};
basic.storyName = 'ArchiveTree';
