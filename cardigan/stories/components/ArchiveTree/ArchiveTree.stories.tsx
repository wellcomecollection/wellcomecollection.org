import ArchiveTree from '@weco/common/views/components/ArchiveTree/ArchiveTree';
import collectionTree from '@weco/catalogue/__mocks__/collection-tree';

const Template = args => <ArchiveTree {...args} />;

export const basic = Template.bind({});
basic.args = {
  work: collectionTree,
};
basic.storyName = 'ArchiveTree';
