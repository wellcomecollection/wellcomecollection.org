import { storiesOf } from '@storybook/react';
import ArchiveTree from '../../../common/views/components/ArchiveTree/ArchiveTree';
import collectionTree from '@weco/catalogue/__mocks__/collection-tree';
// import Readme from '../../../common/views/components/ArchiveTree/README.md';

const stories = storiesOf('Components/Experimental', module);

const ArchiveTreeExample = () => {
  return <ArchiveTree collection={collectionTree} currentWork="be8qkecp" />;
};

stories.add('Archive Tree', ArchiveTreeExample, {
  // readme: { sidebar: Readme },
});
