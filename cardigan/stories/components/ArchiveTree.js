import { storiesOf } from '@storybook/react';
import ArchiveTree from '../../../common/views/components/ArchiveTree/ArchiveTree';
import collectionTree from '@weco/catalogue/__mocks__/collection-tree';

const ArchiveTreeExample = () => {
  return <ArchiveTree work={collectionTree} />;
};

const stories = storiesOf('Components', module);
stories.add('Archive Tree', ArchiveTreeExample);
