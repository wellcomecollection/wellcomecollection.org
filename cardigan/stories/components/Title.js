import Table from '../../../common/views/components/Table/Table';
import Readme from '../../../common/views/components/Table/README.md';
import { storiesOf } from '@storybook/react';

const TableExample = () => {
  return <Table />;
};

const stories = storiesOf('Components', module);
stories.add('Table', TableExample, { readme: { sidebar: Readme } });
