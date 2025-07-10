import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { clock } from '@weco/common/icons';
import LinkLabels from '@weco/content/views/components/LinkLabels';
import Readme from '@weco/content/views/components/LinkLabels/README.mdx';

const meta: Meta<typeof LinkLabels> = {
  title: 'Components/LinkLabels',
  component: LinkLabels,
  render: args => (
    <ReadmeDecorator
      WrappedComponent={LinkLabels}
      args={args}
      Readme={Readme}
    />
  ),
};

export default meta;

type Story = StoryObj<typeof LinkLabels>;

export const Basic: Story = {
  name: 'Default',
  args: {
    items: [
      {
        url: 'https://twitter.com/mafunyane',
        text: '@mafunyane',
      },
      {
        url: 'https://strategiccontent.co.uk/',
        text: 'strategiccontent.co.uk',
      },
    ],
  },
};

export const WithHeading: Story = {
  name: 'With heading',
  args: {
    heading: 'Colours',
    items: [{ text: 'red' }, { text: 'green' }, { text: 'blue' }],
  },
};

export const WithIcon: Story = {
  name: 'With icon',
  args: {
    icon: clock,
    heading: 'Days',
    items: [{ text: 'Monday' }, { text: 'Tuesday' }, { text: 'Wednesday' }],
  },
};
