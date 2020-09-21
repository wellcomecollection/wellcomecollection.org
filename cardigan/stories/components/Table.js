import Table from '../../../common/views/components/Table/Table';
import Readme from '../../../common/views/components/Table/README.md';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs/react';

const TableExample = () => {
  const hasRowHeaders = boolean('Has row headers?', false);

  const rowsWithColHeaders = [
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    ['09:00', '09:00', '09:00', '09:00', '09:00', '09:00'],
    ['10:00', '10:00', '10:00', '10:00', '10:00', '10:00'],
    ['11:00', '11:00', '11:00', '11:00', '11:00', '11:00'],
    ['12:00', '12:00', '12:00', '12:00', '12:00', '12:00'],
    ['13:00', '13:00', '13:00', '13:00', '13:00', '13:00'],
    ['14:00', '14:00', '14:00', '14:00', '14:00', '14:00'],
  ];

  const rowsWithRowHeaders = [
    ['Monday', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    ['Tuesday', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    ['Wednesday', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    ['Thursday', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    ['Friday', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    ['Saturday', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
  ];

  return (
    <Table
      caption={'Delivery schedule'}
      hasRowHeaders={hasRowHeaders}
      rows={hasRowHeaders ? rowsWithRowHeaders : rowsWithColHeaders}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('Table', TableExample, { readme: { sidebar: Readme } });
