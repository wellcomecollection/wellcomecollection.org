import { Meta, StoryObj } from '@storybook/react';

import untransformedBody from '@weco/cardigan_new/stories/data/untransformed-body';
import Body from '@weco/content/components/Body/Body';

const meta: Meta<typeof Body> = {
  title: 'Components/Body',
  component: Body,
  args: {
    untransformedBody,
  },
};

export default meta;

type Story = StoryObj<typeof Body>;

export const Basic: Story = {
  name: 'Body',
};