import { SliceZone } from '@prismicio/react';
import { NextPage } from 'next';
import styled from 'styled-components';

import { landingHeaderBackgroundLs } from '@weco/common/utils/backgrounds';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb';
import PageHeader from '@weco/common/views/components/PageHeader';
import { headerSpaceSize } from '@weco/common/views/components/PageHeader/PageHeader.styles';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { components } from '@weco/common/views/slices';
import * as page from '@weco/content/pages/pages/[pageId]';
import InPageNavigation from '@weco/content/views/components/InPageNavigation';

export const MobileNavBackground = styled(Space).attrs({
  className: 'is-hidden-l is-hidden-xl',
  $v: { size: 'l', properties: ['height'] },
})`
  display: block;
  background-color: ${props => props.theme.color('neutral.700')};
`;

const A11yPrototypePage: NextPage<page.Props> = props => {
  const filteredUntransformedBody = props.page.untransformedBody.filter(
    slice => slice.slice_type !== 'standfirst'
  );
  const firstTextSliceIndex =
    filteredUntransformedBody.find(slice => slice.slice_type === 'text')?.id ||
    '';

  return (
    <PageLayout
      title={props.page.title}
      description={props.page.metadataDescription || ''}
      hideNewsletterPromo={true}
      url={{ pathname: '/visit-us/accessibility' }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      siteSection={props.page.siteSection}
      isNoIndex
    >
      <article data-wio-id={props.page.id}>
        <Space $v={{ size: headerSpaceSize, properties: ['padding-bottom'] }}>
          <PageHeader
            variant="basic"
            breadcrumbs={getBreadcrumbItems(props.page.siteSection)}
            title={props.page.title}
            backgroundTexture={landingHeaderBackgroundLs}
            highlightHeading={true}
          />
        </Space>
        <SpacingSection>
          <SpacingComponent>
            <Container>
              <Grid style={{ background: 'white', rowGap: 0 }}>
                <GridCell $sizeMap={{ s: [12], m: [12], l: [3], xl: [3] }}>
                  <InPageNavigation
                    links={props.page.onThisPage}
                    variant="sticky"
                    isOnWhite
                  />
                </GridCell>
                <GridCell $sizeMap={{ s: [12], m: [12], l: [9], xl: [9] }}>
                  {/* as="section"
                    data-id="works" */}
                  <SliceZone
                    slices={props.page.untransformedBody}
                    components={components}
                    context={{
                      minWidth: 'none',
                      firstTextSliceIndex,
                      pageId: props.page.id,
                    }}
                  />
                </GridCell>
              </Grid>
            </Container>
          </SpacingComponent>
        </SpacingSection>
      </article>
    </PageLayout>
  );
};

export default A11yPrototypePage;
