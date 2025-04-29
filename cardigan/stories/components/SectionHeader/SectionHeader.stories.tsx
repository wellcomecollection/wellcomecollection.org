import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { gridSize12 } from '@weco/common/views/components/Layout';
import Readme from '@weco/content/components/SectionHeader/README.mdx';
import SectionHeader from '@weco/content/components/SectionHeader';

const Template = args => {
  const { gridSize, ...rest } = args;

  return (
    <ReadmeDecorator
      WrappedComponent={SectionHeader}
      args={{
        ...rest,
        gridSize: gridSize === '12' ? gridSize12() : undefined,
      }}
      Readme={Readme}
    />
  );
};

const meta: Meta<typeof SectionHeader> = {
  title: 'Components/SectionHeader',
  component: SectionHeader,
  args: {
    title: 'You may have missed',
    gridSize: undefined,
  },
  argTypes: {
    gridSize: {
      options: ['12', undefined],
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SectionHeader>;

export const Basic: Story = {
  name: 'SectionHeader',
  render: Template,
};
