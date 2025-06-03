import { Meta, StoryObj } from '@storybook/react';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { links } from '@weco/cardigan/stories/data/links';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import { PaletteColor } from '@weco/common/views/themes/config';
import OnThisPageAnchors from '@weco/content/components/OnThisPageAnchors';

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
  activeColor: PaletteColor;
}> = args => {
  const fixedArgs = {
    isSticky: true,
    hasBackgroundBlend: true,
    activeColor: args.activeColor,
    links,
  };
  return (
    <BackgroundGrid $percent={40} $topColor="#323232">
      <GridCell $sizeMap={{ s: [12], m: [3, 1], l: [3, 1], xl: [3, 1] }}>
        <OnThisPageAnchors {...fixedArgs} />
      </GridCell>
      <GridCell $sizeMap={{ s: [12], m: [9, 4], l: [9, 4], xl: [9, 4] }}>
        {links.map(link => (
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

const meta: Meta<typeof OnThisPageAnchorsInColsContext> = {
  title: 'Components/OnThisPageAnchors',
  component: OnThisPageAnchorsInColsContext,
  args: {},
};

export default meta;

type Story = StoryObj<typeof OnThisPageAnchorsInColsContext>;

export const SideBar: Story = {
  name: 'Sticky',
  args: {
    activeColor: 'accent.lightGreen',
  },
};
