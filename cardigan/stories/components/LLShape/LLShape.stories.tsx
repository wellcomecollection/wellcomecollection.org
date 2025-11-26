import { Meta, StoryObj } from '@storybook/react';
import { themeColors } from '@weco/cardigan/.storybook/preview';
import { ComponentProps, FunctionComponent } from 'react';
import { useTheme } from 'styled-components';

import LLShape from '@weco/common/views/components/LLShape';

type StoryProps = ComponentProps<typeof LLShape>;

const meta: Meta<StoryProps> = {
  title: 'Components/LLShape',
  component: LLShape,
  args: {
    color: 'black',
  },
  argTypes: {
    color: {
      name: 'Color',
      control: 'select',
      options: themeColors.map(c => c.name),
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

const LLShapeStory: FunctionComponent<StoryProps> = args => {
  const theme = useTheme();

  return (
    <div style={{ maxWidth: '400px', color: theme.color(args.color) }}>
      <LLShape {...args} />
    </div>
  );
};

export const Basic: Story = {
  name: 'LLShape',
  render: args => <LLShapeStory {...args} />,
};
