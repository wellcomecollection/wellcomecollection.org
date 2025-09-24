import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import FeaturedWorkLink from '@weco/common/views/components/FeaturedWorkLink';

type Props = ComponentProps<typeof FeaturedWorkLink>;
const meta: Meta<Props> = {
  title: 'Components/FeaturedWorkLink',
  component: FeaturedWorkLink,
  args: {
    link: 'https://wellcomecollection.org/works/zsgh5y3z',
    children: 'Default',
  },
  argTypes: {
    link: { table: { disable: true } },
    children: {
      name: 'Link text type',
      control: { type: 'select' },
      options: ['Default', 'Node'],
      mapping: {
        Default: undefined,
        Node: (
          <>
            some link text{' '}
            <span className="visually-hidden">(view in catalogue)</span>
          </>
        ),
      },
    },
  },
};

export default meta;

export const Basic: StoryObj<Props> = {
  name: 'FeaturedWorkLink',
  render: args => <FeaturedWorkLink {...args} />,
};
