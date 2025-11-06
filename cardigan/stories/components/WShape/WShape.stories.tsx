import { Meta, StoryObj } from '@storybook/react';
import { themeColors } from '@weco/cardigan/.storybook/preview';
import { ComponentProps, FunctionComponent } from 'react';
import { useTheme } from 'styled-components';

import WShape from '@weco/common/views/components/WShape';
import { PaletteColor } from '@weco/common/views/themes/config';

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

const WShapeStory: FunctionComponent<StoryProps> = args => {
  const theme = useTheme();

  return (
    <div style={{ maxWidth: '400px', color: theme.color(args.color) }}>
      <WShape {...args} />
    </div>
  );
};

export const Basic: Story = {
  name: 'WShape',
  render: args => <WShapeStory {...args} />,
};
