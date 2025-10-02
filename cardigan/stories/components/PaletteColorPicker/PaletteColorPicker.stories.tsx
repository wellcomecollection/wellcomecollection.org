import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import PaletteColorPicker from '@weco/content/views/components/PaletteColorPicker';

const meta: Meta<typeof PaletteColorPicker> = {
  title: 'Components/PaletteColorPicker',
  component: PaletteColorPicker,
  args: {
    color: '6dd400',
  },
  argTypes: {
    form: { table: { disable: true } },
    name: { table: { disable: true } },
    onChangeColor: { table: { disable: true } },
    color: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof PaletteColorPicker>;

const Template = args => {
  const [color, setColor] = useState(args.color);

  return (
    <PaletteColorPicker {...args} color={color} onChangeColor={setColor} />
  );
};

export const Basic: Story = {
  name: 'PaletteColorPicker',
  render: Template,
};
