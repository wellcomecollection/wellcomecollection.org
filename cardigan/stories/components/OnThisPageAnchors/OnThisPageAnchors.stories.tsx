import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import OnThisPageAnchors from '@weco/content/components/OnThisPageAnchors';
import Readme from '@weco/content/components/OnThisPageAnchors/README.mdx';

const meta: Meta<typeof OnThisPageAnchors> = {
  title: 'Components/OnThisPageAnchors',
  component: OnThisPageAnchors,
  args: {
    links: [
      { text: 'Getting here', url: '#getting-here' },
      {
        text: 'Getting around the building',
        url: '#getting-around-the-building',
      },
      {
        text: 'Accessible exhibitions and events',
        url: '#accessible-exhibitions-and-events',
      },
      {
        text: 'Visual access',
        url: '#visual-access',
      },
      {
        text: 'Auditory access',
        url: '#auditory-access',
      },
      {
        text: 'Wheelchair and physical access',
        url: '#wheelchair-and-physical-access',
      },
      {
        text: 'Sensory access',
        url: '#sensory-access',
      },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof OnThisPageAnchors>;

export const Basic: Story = {
  name: 'OnThisPageAnchors',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={OnThisPageAnchors}
      args={args}
      Readme={Readme}
    />
  ),
};
