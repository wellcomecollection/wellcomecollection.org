import { Meta, StoryObj } from '@storybook/react';

import Table, { Props } from '@weco/content/views/components/Table';

const headerInFirstRow = [
  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  ['09:00', '09:00', '09:00', '09:00', '09:00', '09:00'],
  ['10:00', '10:00', '10:00', '10:00', '10:00', '10:00'],
  ['11:00', '11:00', '11:00', '11:00', '11:00', '11:00'],
  ['12:00', '12:00', '12:00', '12:00', '12:00', '12:00'],
  ['13:00', '13:00', '13:00', '13:00', '13:00', '13:00'],
  ['14:00', '14:00', '14:00', '14:00', '14:00', '14:00'],
];

const headerInFirstColumn = [
  ['Monday', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
  ['Tuesday', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
  ['Wednesday', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
  ['Thursday', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
  ['Friday', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
  ['Saturday', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
];

const Template = args => {
  const { headerPosition, hasRowHeaders, addMoreContent, ...props } = args;

  const getRows = content =>
    addMoreContent
      ? [
          ...content,
          [
            'veeeeeeeeeeeeeeeeeeeeryyyyyyyyyyy loooooooong ttiiiiiiiittllleeeee',
            'veeeeeeeeeeeeeeeeeeeeryyyyyyyyyyy loooooooong ttiiiiiiiittllleeeee',
            'veeeeeeeeeeeeeeeeeeeeryyyyyyyyyyy loooooooong ttiiiiiiiittllleeeee',
            'veeeeeeeeeeeeeeeeeeeeryyyyyyyyyyy loooooooong ttiiiiiiiittllleeeee',
            'veeeeeeeeeeeeeeeeeeeeryyyyyyyyyyy loooooooong ttiiiiiiiittllleeeee',
            'veeeeeeeeeeeeeeeeeeeeryyyyyyyyyyy loooooooong ttiiiiiiiittllleeeee',
          ],
        ]
      : content;

  return (
    <>
      <p>
        On a large desktop, choose &quot;add more content&quot; and resize to
        see navigable arrows
      </p>
      <Table
        rows={
          headerPosition === 'row'
            ? getRows(headerInFirstColumn)
            : getRows(headerInFirstRow)
        }
        hasRowHeaders={headerPosition === 'row'}
        {...props}
      />
    </>
  );
};

type StoryProps = {
  headerPosition: 'row' | 'column';
  addMoreContent: boolean;
};

const meta: Meta<Props & StoryProps> = {
  title: 'Components/Tables/Table',
  component: Table,
  args: {
    caption: 'Delivery schedule',
    plain: false,
    withBorder: false,
    vAlign: 'middle',
    headerPosition: 'column',
    addMoreContent: false,
    hasSmallerCopy: false,
  },
  argTypes: {
    caption: { control: 'text', name: 'Caption' },
    vAlign: {
      name: 'Vertical align',
      options: ['top', 'middle', 'bottom'],
      control: { type: 'radio' },
    },
    plain: { name: 'Plain', control: 'boolean' },
    withBorder: { name: 'With border', control: 'boolean' },
    headerPosition: {
      name: 'Header position',
      options: ['row', 'column'],
      control: { type: 'radio' },
    },
    addMoreContent: { name: 'Add longer content', control: 'boolean' },
    hasSmallerCopy: { name: 'Smaller copy', control: 'boolean' },
    rows: { table: { disable: true } },
    hasRowHeaders: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<Props>;

export const Basic: Story = {
  name: 'Table',
  render: Template,
};
