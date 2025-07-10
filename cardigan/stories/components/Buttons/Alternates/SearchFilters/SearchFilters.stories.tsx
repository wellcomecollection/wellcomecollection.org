import { Meta, StoryObj } from '@storybook/react';

import { linkResolver } from '@weco/common/utils/search';
import SearchFilters from '@weco/content/views/components/SearchFilters';

const meta: Meta<typeof SearchFilters> = {
  title: 'Components/Buttons/Alternates/SearchFilters',
  component: SearchFilters,
  args: {
    filters: [
      {
        type: 'checkbox',
        id: 'contributors',
        label: 'Contributors',
        options: [
          {
            id: 'bbb',
            value: 'johndoe',
            label: 'John Doe',
            selected: false,
          },
          {
            id: 'ccc',
            value: 'janedoe',
            label: 'Jane Doe',
            selected: false,
          },
          {
            id: 'ddd',
            value: 'joebloggs',
            label: 'Joe Bloggs',
            selected: false,
          },
          {
            id: 'eee',
            value: 'johnsmith',
            label: 'John Smith',
            selected: false,
          },
          {
            id: 'fff',
            value: 'poppypoppyseed',
            label: 'Poppy von Poppyseed',
            selected: false,
          },
        ],
      },
      {
        type: 'dateRange',
        id: 'dates',
        label: 'Dates',
        from: { id: 'from', value: '' },
        to: { id: 'to', value: '' },
      },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof SearchFilters>;

const SearchFiltersTemplate = args => {
  return (
    <SearchFilters
      {...args}
      changeHandler={() => {
        // do nothing
      }}
      linkResolver={params => linkResolver({ params, pathname: '/' })}
    />
  );
};

export const Basic: Story = {
  name: 'SearchFilters',
  render: SearchFiltersTemplate,
};
