import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import Readme from '@weco/content/components/Tags/README.mdx';
import Tags from '@weco/content/components/Tags';

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
};

export default meta;

type Story = StoryObj<typeof Tags>;

export const Basic: Story = {
  name: 'Tags',
  render: args => (
    <ReadmeDecorator WrappedComponent={Tags} args={args} Readme={Readme} />
  ),
};
