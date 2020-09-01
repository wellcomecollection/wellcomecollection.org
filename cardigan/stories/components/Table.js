import Table from '../../../common/views/components/Table/Table';
import Readme from '../../../common/views/components/Table/README.md';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs/react';

const TableExample = () => {
  const hasRowHeaders = boolean('Has row headers?', false);

  const rowsWithColHeaders = [
    {
      items: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
    },
    {
      items: ['09:00', '09:00', '09:00', '09:00', '09:00', '09:00'],
    },
    {
      items: ['10:00', '10:00', '10:00', '10:00', '10:00', '10:00'],
    },
    {
      items: ['11:00', '11:00', '11:00', '11:00', '11:00', '11:00'],
    },
    {
      items: ['12:00', '12:00', '12:00', '12:00', '12:00', '12:00'],
    },
    {
      items: ['13:00', '13:00', '13:00', '13:00', '13:00', '13:00'],
    },
    {
      items: ['14:00', '14:00', '14:00', '14:00', '14:00', '14:00'],
    },
  ];

  const rowsWithRowHeaders = [
    {
      items: ['Monday', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    },
    {
      items: ['Tuesday', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    },
    {
      items: [
        'Wednesday',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
      ],
    },
    {
      items: ['Thursday', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    },
    {
      items: ['Friday', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    },
    {
      items: ['Saturday', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    },
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
