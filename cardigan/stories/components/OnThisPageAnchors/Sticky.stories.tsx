import { Meta, StoryObj } from '@storybook/react';
import { themeColors } from '@weco/cardigan/.storybook/preview';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { links } from '@weco/cardigan/stories/components/OnThisPageAnchors/links';
import Footer from '@weco/common/views/components/Footer';
import PageHeader from '@weco/common/views/components/PageHeader';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import { PaletteColor } from '@weco/common/views/themes/config';
import OnThisPageAnchors from '@weco/content/components/OnThisPageAnchors';

type BackgroundGridProps = {
  $percent?: number;
  $topColor?: string;
  $bottomColor?: string;
};

const BackgroundGrid = styled(Grid).attrs({})<BackgroundGridProps>`
  padding: 0 20px;
  margin-top: 10px;
  background: linear-gradient(
    5deg,
    ${props => props.$bottomColor ?? 'white'} 0%,
    ${props => props.$bottomColor ?? 'white'} ${props => props.$percent ?? 40}%,
    ${props => props.theme.color(props.$topColor) ?? 'black'}
      ${props => props.$percent ?? 40}%,
    ${props => props.theme.color(props.$topColor) ?? 'black'} 100%
  );
`;

const OnThisPageAnchorsInColsContext: FunctionComponent<{
  topColor?: PaletteColor;
}> = args => {
  const fixedArgs = {
    isSticky: true,
    hasBackgroundBlend: true,
    links,
  };

  return (
    <div>
      <PageHeader
        breadcrumbs={{ items: [] }}
        title="Sticky On This Page Anchors"
      />
      <BackgroundGrid $percent={40} $topColor={args.topColor}>
        <GridCell $sizeMap={{ s: [12], m: [12], l: [3], xl: [3] }}>
          <OnThisPageAnchors {...fixedArgs} />
        </GridCell>
        <GridCell $sizeMap={{ s: [12], m: [12], l: [9], xl: [9] }}>
          {links.map(link => (
            <div
              key={link.url}
              style={{
                padding: '16px',
                backgroundColor: 'white',
                marginBottom: '16px',
              }}
            >
              <h2
                id={link.url.replace('#', '')}
                style={{
                  scrollMarginTop: '1rem',
                }}
              >
                {link.text}
              </h2>
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
      <Footer venues={[]} />
    </div>
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
    topColor: 'neutral.700',
  },
  argTypes: {
    topColor: {
      control: 'select',
      options: themeColors.map(c => c.name),
      description: 'Color used for the top background',
    },
  },
};
