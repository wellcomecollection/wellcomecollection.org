import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import SearchBar from '@weco/common/views/components/SearchBar';

const SearchBarStory = ({ variant, placeholder, location }) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <form id="storybook-search-form">
        <SearchBar
          variant={variant}
          inputValue={inputValue}
          setInputValue={setInputValue}
          placeholder={placeholder}
          form="storybook-search-form"
          location={location}
        />
      </form>
    </div>
  );
};

const meta: Meta<typeof SearchBar> = {
  title: 'Components/Inputs/SearchBar',
  component: SearchBar,
  args: {
    variant: 'default',
    placeholder: 'Search our collections',
    location: 'page',
  },
  argTypes: {
    variant: {
      options: ['default', 'new'],
      control: { type: 'radio' },
    },
    placeholder: {
      table: { disable: true },
    },
    location: {
      table: { disable: true },
    },
  },
  parameters: {
    chromatic: { delay: 2000 },
  },
};

export default meta;

type Story = StoryObj<typeof SearchBar>;

export const Basic: Story = {
  name: 'SearchBar',
  render: args => <SearchBarStory {...args} />,
};
