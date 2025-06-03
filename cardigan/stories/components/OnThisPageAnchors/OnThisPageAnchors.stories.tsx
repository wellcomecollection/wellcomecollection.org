import { Meta, StoryObj } from '@storybook/react';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
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

type BackgroundGridProps = {
  $percent?: number;
  $topColor?: string;
  $bottomColor?: string;
};

const BackgroundGrid = styled(Grid).attrs({})<BackgroundGridProps>`
  background: linear-gradient(
    5deg,
    ${props => props.$bottomColor ?? 'white'} 0%,
    ${props => props.$bottomColor ?? 'white'} ${props => props.$percent ?? 40}%,
    ${props => props.$topColor ?? 'black'} ${props => props.$percent ?? 40}%,
    ${props => props.$topColor ?? 'black'} 100%
  );
`;

const OnThisPageAnchorsInColsContext: FunctionComponent<{
  links: { text: string; url: string }[];
}> = args => {
  return (
    <BackgroundGrid $percent={40} $topColor="#323232">
      <GridCell $sizeMap={{ s: [12], m: [3, 1], l: [3, 1], xl: [3, 1] }}>
        <OnThisPageAnchors {...args} />
      </GridCell>
      <GridCell $sizeMap={{ s: [12], m: [9, 4], l: [9, 4], xl: [9, 4] }}>
        {args.links.map(link => (
          <div
            key={link.url}
            style={{
              padding: '16px',
              backgroundColor: 'white',
              marginBottom: '16px',
            }}
          >
            <h2 id={link.url.replace('#', '')}>{link.text}</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        ))}
      </GridCell>
    </BackgroundGrid>
  );
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

export const SideBar: Story = {
  name: 'OnThisPageAnchorsSideBar',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={OnThisPageAnchorsInColsContext}
      args={{
        ...args,
        hasBackgroundBlend: true,
        isSticky: true,
        activeColor: '#9BC0AF',
      }}
      Readme={Readme}
    />
  ),
};
