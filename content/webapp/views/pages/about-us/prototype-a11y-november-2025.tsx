import { SliceZone } from '@prismicio/react';
import { NextPage } from 'next';
import styled from 'styled-components';

import { landingHeaderBackgroundLs } from '@weco/common/utils/backgrounds';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb';
import PageHeader from '@weco/common/views/components/PageHeader';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
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
  return (
    <PageLayout
      title={props.page.title}
      description={props.page.metadataDescription || ''}
      hideNewsletterPromo={true}
      url={{ pathname: '/about-us/accessibility' }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      siteSection={props.page.siteSection}
      isNoIndex
    >
      <PageHeader
        variant="basic"
        breadcrumbs={getBreadcrumbItems(props.page.siteSection)}
        title={props.page.title}
        backgroundTexture={landingHeaderBackgroundLs}
        highlightHeading={true}
      />
      <Container>
        <Grid style={{ background: 'white', rowGap: 0 }}>
          <GridCell $sizeMap={{ s: [12], m: [12], l: [3], xl: [2] }}>
            <InPageNavigation
              links={props.page.onThisPage}
              variant="sticky"
              isOnWhite
            />
          </GridCell>
          <GridCell $sizeMap={{ s: [12], m: [12], l: [9], xl: [10] }}>
            <SliceZone
              slices={props.page.untransformedBody}
              components={components}
              context={{ minWidth: 'none' }}
            />
          </GridCell>
        </Grid>
      </Container>
    </PageLayout>
  );
};

export default A11yPrototypePage;
