import { Meta, StoryObj } from '@storybook/react';

import Header, {
  exhibitionGuidesLinks,
} from '@weco/common/views/components/Header';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  args: {
    siteSection: 'stories',
    isMinimalHeader: false,
  },
  argTypes: {
    customNavLinks: { table: { disable: true } },
    isMinimalHeader: { name: 'Is minimal header', control: 'boolean' },
    siteSection: {
      name: 'Selected site section',
      control: 'radio',
      options: ['visit-us', 'stories', 'collections', 'about-us'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Basic: Story = {
  name: 'Header',
  render: args => {
    const { isMinimalHeader, ...rest } = args;

    return (
      <Header
        customNavLinks={isMinimalHeader ? exhibitionGuidesLinks : undefined}
        isMinimalHeader={isMinimalHeader}
        {...rest}
      />
    );
  },
};
