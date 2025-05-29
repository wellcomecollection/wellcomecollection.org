import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import OnThisPageAnchors from '@weco/content/components/OnThisPageAnchors';
import Readme from '@weco/content/components/OnThisPageAnchors/README.mdx';

import { Grid } from '@weco/common/views/components/styled/Grid';

import styled from 'styled-components';

import { FunctionComponent } from 'react';

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

interface BackgroundGridProps {
  $percent?: number;
}

const BackgroundGrid = styled(Grid).attrs({})<BackgroundGridProps>`
  background:
    linear-gradient(5deg, white 0%, white ${props => props.$percent ?? 40}%, black ${props => props.$percent ?? 40}%, black 100%);
  box-sizing: border-box;
  & > * {
    min-height: 0;
  }
`;

const OnThisPageAnchorsInColsContext: FunctionComponent<{
  links: { text: string; url: string }[];
}> = (args) => {
  return (
    // TODO: use existing grid component
    <BackgroundGrid $percent={40}>
      <div style={{ gridColumn: 'span 3' }}>
        <OnThisPageAnchors {...args} />
      </div>
      <div style={{ gridColumn: 'span 9', paddingTop: '32px' }}>
        {args.links.map((link) => (
          <div key={link.url} id={link.url.replace('#', '')} style={{ padding: '16px', backgroundColor: 'white', marginBottom: '16px' }}>
            <h2>{link.text}</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        ))}
      </div>
    </BackgroundGrid>
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

export const SideBar: Story = {
  name: 'OnThisPageAnchorsSideBar',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={OnThisPageAnchorsInColsContext}
      args={{...args, backgroundBlend: true, sticky: true}}
      Readme={Readme}
    />
  ),
};
