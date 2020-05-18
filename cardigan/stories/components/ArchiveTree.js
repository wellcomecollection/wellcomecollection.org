import { storiesOf } from '@storybook/react';
import ArchiveTree from '../../../common/views/components/ArchiveTree/ArchiveTree';
import collectionTree from '@weco/catalogue/__mocks__/collection-tree';
// import Readme from '../../../common/views/components/ArchiveTree/README.md';

const stories = storiesOf('Components', module);

const ArchiveTreeExample = () => {
  return <ArchiveTree collection={collectionTree} currentWork="b5ufy8am" />;
};

stories.add('Archive Tree', ArchiveTreeExample, {
  // readme: { sidebar: Readme },
});
