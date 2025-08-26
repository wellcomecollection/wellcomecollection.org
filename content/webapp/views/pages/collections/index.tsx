import { NextPage } from 'next';
import styled from 'styled-components';

import { SiteSection } from '@weco/common/model/site-section';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { defaultSerializer } from '@weco/common/views/components/HTMLSerializers';
import {
  ContaineredLayout,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import Space from '@weco/common/views/components/styled/Space';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import FeaturedText from '@weco/content/views/components/FeaturedText';
import { Props as PagePageProps } from '@weco/content/views/pages/pages/page';

const HeaderBackground = styled.div`
  position: absolute;
  top: 100px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  z-index: -1;

  background-color: ${props => props.theme.color('accent.lightBlue')};
`;

const CollectionsLandingPage: NextPage<PagePageProps> = ({
  page,
  // siblings,
  // children,
  // ordersInParents,
  // staticContent,
  jsonLd,
}) => {
  return (
    <PageLayout
      title={page.title}
      description={page.metadataDescription || page.promo?.caption || ''}
      url={{
        pathname: `${page?.siteSection ? '/' + page.siteSection : ''}/${page.uid}`,
      }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection={page?.siteSection as SiteSection}
      image={page.image}
      apiToolbarLinks={[createPrismicLink(page.id)]}
      isNoIndex // TODO remove when this becomes the page
      hideNewsletterPromo
    >
      <PageHeader
        title={page.title}
        breadcrumbs={{ items: [], noHomeLink: true }} // TODO
        Background={<HeaderBackground />}
      />
      {page.introText && (
        <ContaineredLayout gridSizes={gridSize8(false)}>
          <div className="body-text spaced-text">
            <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
              <FeaturedText
                html={page.introText}
                htmlSerializer={defaultSerializer}
              />
            </Space>
          </div>
        </ContaineredLayout>
      )}
    </PageLayout>
  );
};

export default CollectionsLandingPage;
