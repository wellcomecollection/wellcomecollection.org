import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import OnThisPageAnchors from '@weco/content/components/OnThisPageAnchors';
import Readme from '@weco/content/components/OnThisPageAnchors/README.mdx';

import { FunctionComponent } from 'react';

const meta: Meta<typeof OnThisPageAnchors> = {
  title: 'Components/OnThisPageAnchors',
  component: OnThisPageAnchors,
  args: {
    sticky: false,
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

// create a 2 column grid component that can be used as
// a wrapper for the OnThisPageAnchors component

const OnThisPageAnchorsInColsContext: FunctionComponent<{
  links: { text: string; url: string }[];
}> = (args) => {
  return (
    // use existing grid component
    <div style={{ background: 'linear-gradient(5deg, black 50%, white 50%)', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
      <div style={{ gridColumn: 'span 1' }}>
        <OnThisPageAnchors {...args} />
      </div>
      <div style={{ gridColumn: 'span 1', paddingTop: '32px' }}>
        {args.links.map((link) => (
          <div key={link.url} id={link.url.replace('#', '')} style={{ padding: '16px', backgroundColor: 'white', marginBottom: '16px' }}>
            <h2>{link.text}</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

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

export const Fancy: Story = {
  name: 'OnThisPageAnchorsFancy',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={OnThisPageAnchorsInColsContext}
      args={args}
      Readme={Readme}
    />
  ),
};
