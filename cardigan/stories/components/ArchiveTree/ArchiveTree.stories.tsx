import ArchiveTree from '@weco/catalogue/components/ArchiveTree/ArchiveTree';
import collectionTree from '@weco/cardigan/stories/data/collection-tree';

const Template = args => <ArchiveTree {...args} />;

export const basic = Template.bind({});
basic.args = {
  work: collectionTree,
};
basic.storyName = 'ArchiveTree';
basic.parameters = { chromatic: { viewports: [375, 1200] } };
