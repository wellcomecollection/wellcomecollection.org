import { SliceZone } from '@prismicio/react';
import { NextPage } from 'next';

import { cookiesTableCopy } from '@weco/common/data/cookies';
import { landingHeaderBackgroundLs } from '@weco/common/utils/backgrounds';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { policyUpdatedDate } from '@weco/common/views/components/CivicUK';
import {
  ContaineredLayout,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { components } from '@weco/common/views/slices';
import * as page from '@weco/content/pages/pages/[pageId]';
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
        breadcrumbs={{ items: [] }}
        title={props.page.title}
        backgroundTexture={landingHeaderBackgroundLs}
        highlightHeading={true}
      />
      <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
        <Space $v={{ size: 'xl', properties: ['padding-bottom'] }}>
          {props.page.untransformedBody.map((slice, index) => {
            return tablesPosition.includes(index) ? (
              <CookieTable
                key={index}
                rows={cookiesTableCopy[slice.primary?.text?.[0]?.text]}
              />
            ) : (
              <SliceZone key={index} slices={[slice]} components={components} />
            );
          })}

          <SpacingComponent>
            <ContaineredLayout gridSizes={gridSize8()}>
              <div className="body-text spaced-text">
                <p>
                  <em>This policy was last updated on {policyUpdatedDate}.</em>
                </p>
              </div>
            </ContaineredLayout>
          </SpacingComponent>
        </Space>
      </Space>
    </PageLayout>
  );
};

export default CookiePolicyPage;
