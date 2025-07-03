import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import Tags from '@weco/common/views/components/Tags';
import Readme from '@weco/common/views/components/Tags/README.mdx';

const nextLink = {
  href: {
    pathname: '/search/works',
    query: {
      query: 'sun',
      page: 2,
    },
  },
  as: {
    pathname: '/search/works',
    query: {
      query: 'sun',
      page: 2,
    },
  },
};

const meta: Meta<typeof Tags> = {
  title: 'Components/Tags',
  component: Tags,
  args: {
    isFirstPartBold: false,
    separator: '–',
    tags: [
      {
        textParts: ['Medical illustration'],
        linkAttributes: nextLink,
      },
      {
        textParts: ['Dentistry', 'History'],
        linkAttributes: nextLink,
      },
      {
        textParts: ['Teeth', 'Care and hygiene', 'History', 'Pictorial works'],
        linkAttributes: nextLink,
      },
    ],
  },
  argTypes: {
    tags: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tags>;

export const Basic: Story = {
  name: 'Tags',
  render: args => (
    <ReadmeDecorator WrappedComponent={Tags} args={args} Readme={Readme} />
  ),
};
