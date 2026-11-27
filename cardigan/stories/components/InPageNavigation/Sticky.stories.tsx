import { Meta, StoryObj } from '@storybook/react';
import { themeColors } from '@weco/cardigan/.storybook/preview';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { links } from '@weco/cardigan/stories/components/InPageNavigation/links';
import DecorativeEdge from '@weco/common/views/components/DecorativeEdge';
import Footer from '@weco/common/views/components/Footer';
import PageHeader from '@weco/common/views/components/PageHeader';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import {
  pageBackgroundColor,
  PaletteColor,
} from '@weco/common/views/themes/config';
import InPageNavigation from '@weco/content/views/components/InPageNavigation';
import Readme from '@weco/content/views/components/InPageNavigation/README.mdx';

const BodyGrid = styled(Grid)`
  background: ${props => props.theme.color(pageBackgroundColor)};
  row-gap: 0;
`;

// Mirrors the concept page's images band, which the nav's split colours follow
const DarkBand = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})<{ $topColor: PaletteColor }>`
  position: relative;
  background: ${props => props.theme.color(props.$topColor)};
  ${props => props.theme.pageGridOffset('margin-right')};

  &::before {
    content: '';
    position: absolute;
    width: calc(100vw - 100%);
    top: 0;
    bottom: 0;
    right: 100%;
    background: inherit;
  }
`;

const EdgeWrapper = styled.div`
  position: relative;
  margin-left: calc((100vw - 100%) * -1);
  ${props => props.theme.pageGridOffset('margin-right')};
`;

const GreySpace = styled(Space).attrs({
  $v: { size: 'md', properties: ['height'] },
})<{ $topColor: PaletteColor }>`
  background-color: ${props => props.theme.color(props.$topColor)};
`;

const Section: FunctionComponent<{
  link: (typeof links)[number];
  isOnDark?: boolean;
}> = ({ link, isOnDark }) => (
  <section
    style={{
      padding: '16px',
      backgroundColor: isOnDark ? 'transparent' : 'white',
      color: isOnDark ? 'white' : undefined,
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
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </p>
  </section>
);

const InPageNavigationInColsContext: FunctionComponent<{
  topColor?: PaletteColor;
}> = ({ topColor = 'neutral.700' }) => {
  const bandLinks = links.slice(0, 2);
  const otherLinks = links.slice(2);

  return (
    <div style={{ overflowX: 'clip' }}>
      <PageHeader variant="landing" title="Sticky On This Page Anchors" />
      <GreySpace $topColor={topColor} />
      <Container>
        <BodyGrid>
          <InPageNavigation
            links={links}
            sizeMap={{ s: [12], m: [12], l: [3], xl: [3] }}
          />

          <GridCell $sizeMap={{ s: [12], m: [12], l: [9], xl: [9] }}>
            <DarkBand $topColor={topColor} data-in-page-nav-dark>
              {bandLinks.map(link => (
                <Section key={link.url} link={link} isOnDark />
              ))}
            </DarkBand>
            <EdgeWrapper data-in-page-nav-dark-edge>
              <DecorativeEdge
                variant="wobbly"
                backgroundColor={pageBackgroundColor}
                fixedUntil='[data-component="in-page-navigation"]'
              />
            </EdgeWrapper>
            <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
              {otherLinks.map(link => (
                <Section key={link.url} link={link} />
              ))}
            </Space>
          </GridCell>
        </BodyGrid>
      </Container>
      <Footer venues={[]} />
    </div>
  );
};

const meta: Meta<typeof InPageNavigationInColsContext> = {
  title: 'Components/InPageNavigation',
  component: InPageNavigationInColsContext,
  args: {},
  // The nav's full-width backgrounds only reach into the page's own gutter
  parameters: { layout: 'fullscreen' },
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
  render: args => (
    <ReadmeDecorator
      WrappedComponent={InPageNavigationInColsContext}
      args={args}
      Readme={Readme}
    />
  ),
};
