import { Meta, StoryObj } from '@storybook/react';

import Header, {
  exhibitionGuidesLinks,
} from '@weco/common/views/components/Header';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  args: {
    siteSection: 'stories',
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Basic: Story = {
  name: 'Default',
};

export const ExhibitionGuides: Story = {
  name: 'Exhibition guides',
  args: {
    customNavLinks: exhibitionGuidesLinks,
    isMinimalHeader: true,
  },
};
