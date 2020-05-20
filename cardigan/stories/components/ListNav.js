import { storiesOf } from '@storybook/react';
import ListNav from '../../../common/views/components/ListNav/ListNav';
import Readme from '../../../common/views/components/ListNav/README.md';

const ListNavExample = () => {
  return <ListNav workId="hz43r7re" />;
};

const stories = storiesOf('Components', module);
stories.add('ListNav', ListNavExample, { readme: { sidebar: Readme } });
