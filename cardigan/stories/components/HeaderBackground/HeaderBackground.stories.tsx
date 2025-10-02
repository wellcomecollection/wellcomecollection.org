import { Meta, StoryObj } from '@storybook/react';

import {
  headerBackgroundLs,
  landingHeaderBackgroundLs,
} from '@weco/common/utils/backgrounds';
import HeaderBackground from '@weco/common/views/components/HeaderBackground';

const meta: Meta<typeof HeaderBackground> = {
  title: 'Components/HeaderBackground',
  component: HeaderBackground,
  args: {
    backgroundTexture: undefined,
    hasWobblyEdge: true,
    useDefaultBackgroundTexture: true,
  },
  argTypes: {
    hasWobblyEdge: { control: 'boolean', name: 'Has wobbly edge' },
    useDefaultBackgroundTexture: {
      control: 'boolean',
      name: 'Use default background texture',
    },
    backgroundTexture: {
      control: 'select',
      name: 'Background texture URL (can be any URL)',
      options: ['Header background', 'Landing header background'],
      mapping: {
        'Header background': headerBackgroundLs,
        'Landing header background': landingHeaderBackgroundLs,
      },
      if: { arg: 'useDefaultBackgroundTexture', truthy: false },
    },
  },
};

export default meta;

type Story = StoryObj<typeof HeaderBackground>;

export const Basic: Story = {
  name: 'HeaderBackground',
  render: args => <HeaderBackground {...args} />,
};
