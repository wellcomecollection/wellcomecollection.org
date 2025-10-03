import { Meta, StoryObj } from '@storybook/react';
import { themeColors } from '@weco/cardigan/.storybook/preview';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { links } from '@weco/cardigan/stories/components/InPageNavigation/links';
import Footer from '@weco/common/views/components/Footer';
import PageHeader from '@weco/common/views/components/PageHeader';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';
import InPageNavigation from '@weco/content/views/components/InPageNavigation';

type BackgroundGridProps = {
  $percent?: number;
  $topColor?: string;
  $bottomColor?: string;
};

const NavGridCell = styled(GridCell)`
  position: sticky;
  top: 0;

  ${props =>
    props.theme.media('large')(`
     mix-blend-mode: difference;
  `)}
`;

const BackgroundGrid = styled(Grid)<BackgroundGridProps>`
  padding: 0 20px;
  background: linear-gradient(
    5deg,
    ${props => props.$bottomColor ?? 'white'} 0%,
    ${props => props.$bottomColor ?? 'white'} ${props => props.$percent ?? 40}%,
    ${props => props.theme.color(props.$topColor) ?? 'black'}
      ${props => props.$percent ?? 40}%,
    ${props => props.theme.color(props.$topColor) ?? 'black'} 100%
  );
`;

const GreySpace = styled(Space).attrs({
  $v: { size: 'l', properties: ['height'] },
})<{ $topColor?: PaletteColor }>`
  background-color: ${props =>
    props.theme.color(props.$topColor ?? 'neutral.700')};
`;

const InPageNavigationInColsContext: FunctionComponent<{
  topColor?: PaletteColor;
}> = args => {
  const fixedArgs = {
    isSticky: true,
    links,
  };

  return (
    <div>
      <PageHeader
        variant="legacyLanding"
        sectionLevelPage
        title="Sticky On This Page Anchors"
      />
      <GreySpace
        $topColor={args.topColor}
        $v={{ size: 'l', properties: ['height'] }}
      />
      <BackgroundGrid $percent={40} $topColor={args.topColor}>
        <NavGridCell $sizeMap={{ s: [12], m: [12], l: [3], xl: [3] }}>
          <InPageNavigation {...fixedArgs} variant="sticky" />
        </NavGridCell>
        <GridCell $sizeMap={{ s: [12], m: [12], l: [9], xl: [9] }}>
          {links.map(link => (
            <section
              data-id={link.url.replace('#', '')}
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
            </section>
          ))}
        </GridCell>
      </BackgroundGrid>
      <Footer venues={[]} />
    </div>
  );
};

const meta: Meta<typeof InPageNavigationInColsContext> = {
  title: 'Components/InPageNavigation',
  component: InPageNavigationInColsContext,
  args: {},
};

export default meta;

type Story = StoryObj<typeof InPageNavigationInColsContext>;

export const SideBar: Story = {
  name: 'Sticky',
  args: {
    topColor: 'neutral.700',
  },
  argTypes: {
    topColor: {
      name: 'Top background color',
      control: 'select',
      options: themeColors.map(c => c.name),
      description: 'Color used for the top background',
    },
  },
};
