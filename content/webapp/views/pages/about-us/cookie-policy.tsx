import { SliceZone } from '@prismicio/react';
import { NextPage } from 'next';

import { cookiesTableCopy } from '@weco/common/data/cookies';
import { useToggles } from '@weco/common/server-data/Context';
import { landingHeaderBackgroundLs } from '@weco/common/utils/backgrounds';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { policyUpdatedDate } from '@weco/common/views/components/CivicUK';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import {
  ContaineredLayout,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { components } from '@weco/common/views/slices';
import * as page from '@weco/content/pages/pages/[pageId]';
import InPageNavigation from '@weco/content/views/components/InPageNavigation';
import Table from '@weco/content/views/components/Table';

const CookieTable = ({ rows }: { rows: string[][] }) => {
  return (
    <SpacingComponent>
      <ContaineredLayout gridSizes={gridSize8()}>
        <Table rows={rows} withBorder={true} hasSmallerCopy></Table>
      </ContaineredLayout>
    </SpacingComponent>
  );
};

const CookiePolicyPage: NextPage<page.Props> = props => {
  const { twoColumns } = useToggles();
  const { onThisPage, showOnThisPage } = props.page;

  // This copy should be exactly what can be found in the text slices representing the tables
  const EXPECTED_TABLE_NAMES = [
    '[necessary_cookies_table]',
    '[analytics_cookies_table]',
    '[marketing_cookies_table]',
  ];

  // Find their positions so we can insert them in the correct order
  const tablesPosition = props.page.untransformedBody
    .map((slice, index) => {
      if (EXPECTED_TABLE_NAMES.includes(slice.primary?.text?.[0]?.text))
        return index;
      return undefined;
    })
    .filter(isNotUndefined);

  const displayOnThisPage =
    showOnThisPage && onThisPage && onThisPage.length > 2;
  const isTwoColumns = !!(twoColumns && displayOnThisPage);

  return (
    <PageLayout
      title={props.page.title}
      description={props.page.metadataDescription || ''}
      hideNewsletterPromo={true}
      url={{ pathname: '/about-us/cookie-policy' }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      siteSection={props.page.siteSection}
    >
      <PageHeader
        variant="basic"
        breadcrumbs={{ items: [] }}
        title={props.page.title}
        backgroundTexture={landingHeaderBackgroundLs}
        highlightHeading={true}
      />
      <ConditionalWrapper
        condition={isTwoColumns}
        wrapper={children => (
          <Container>
            <Grid style={{ background: 'white', rowGap: 0 }}>
              <InPageNavigation
                variant="sticky"
                links={onThisPage!}
                sizeMap={{ s: [12], m: [12], l: [3], xl: [3] }}
                isOnWhite
              />

              <GridCell $sizeMap={{ s: [12], m: [12], l: [9], xl: [9] }}>
                <Space $v={{ size: 'sm', properties: ['padding-top'] }}>
                  {children}
                </Space>
              </GridCell>
            </Grid>
          </Container>
        )}
      >
        <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
          <Space $v={{ size: 'xl', properties: ['padding-bottom'] }}>
            {props.page.untransformedBody.map((slice, index) => {
              return tablesPosition.includes(index) ? (
                <CookieTable
                  key={index}
                  rows={cookiesTableCopy[slice.primary?.text?.[0]?.text]}
                />
              ) : (
                <SliceZone
                  key={index}
                  slices={[slice]}
                  components={components}
                  context={{
                    gridSizes: isTwoColumns ? undefined : gridSize8(),
                  }}
                />
              );
            })}

            <SpacingComponent>
              <ContaineredLayout gridSizes={gridSize8()}>
                <div className="body-text spaced-text">
                  <p>
                    <em>
                      This policy was last updated on {policyUpdatedDate}.
                    </em>
                  </p>
                </div>
              </ContaineredLayout>
            </SpacingComponent>
          </Space>
        </Space>
      </ConditionalWrapper>
    </PageLayout>
  );
};

export default CookiePolicyPage;
