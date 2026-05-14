import { SliceZone } from '@prismicio/react';

import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { gridSize12 } from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import Space from '@weco/common/views/components/styled/Space';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { components } from '@weco/common/views/slices';
import { Page } from '@weco/content/types/pages';

export type Props = {
  page: Page;
};

const KioskStoriesListingPage = ({ page }: Props) => {
  const introText = page.introText;

  return (
    <PageLayout
      openGraphType={'website' as const}
      jsonLd={[]}
      siteSection="stories"
      title={page.title}
      description={page.metadataDescription || page.promo?.caption || ''}
      url={{ pathname: '/stories/kiosk' }}
      image={page.image}
      apiToolbarLinks={[createPrismicLink(page.id)]}
      clipOverflowX
      hideNewsletterPromo
      hideFooter
      hideHeader
      isNoIndex
    >
      <PageHeader variant="landing" title={page.title} introText={introText} />

      <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
        <SliceZone
          slices={page.untransformedBody}
          components={components}
          context={{ gridSizes: gridSize12() }}
        />
      </Space>
    </PageLayout>
  );
};

export default KioskStoriesListingPage;
