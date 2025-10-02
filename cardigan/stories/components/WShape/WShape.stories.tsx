import { Meta, StoryObj } from '@storybook/react';
import { themeColors } from '@weco/cardigan/.storybook/preview';
import { ComponentProps } from 'react';

import { PaletteColor, themeValues } from '@weco/common/views/themes/config';
import WShape from '@weco/content/views/components/WShape';

type StoryProps = ComponentProps<typeof WShape> & {
  color: PaletteColor;
};

const meta: Meta<StoryProps> = {
  title: 'Components/WShape',
  component: WShape,
  args: {
    variant: 'full-1',
    color: 'black',
  },
  argTypes: {
    variant: { name: 'Variant' },
    color: {
      name: 'Color',
      control: 'select',
      options: themeColors.map(c => c.name),
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Basic: Story = {
  name: 'WShape',
  render: args => (
    <div style={{ maxWidth: '400px', color: themeValues.color(args.color) }}>
      <WShape {...args} />
    </div>
  ),
};
