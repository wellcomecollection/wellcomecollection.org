import { storiesOf } from '@storybook/react';
import ArchiveTree from '../../../common/views/components/ArchiveTree/ArchiveTree';
import collectionTree from '@weco/catalogue/__mocks__/collection-tree';

const stories = storiesOf('Components/Experimental', module);

const ArchiveTreeExample = () => {
  return <ArchiveTree collection={collectionTree} currentWork="be8qkecp" />;
};

stories.add('Archive Tree', ArchiveTreeExample);
