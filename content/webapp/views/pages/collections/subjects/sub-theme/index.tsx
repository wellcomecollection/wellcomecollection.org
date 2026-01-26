import * as prismic from '@prismicio/client';
import { NextPage } from 'next';
import { ReactElement } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import ThematicBrowsingLayout from '@weco/content/views/layouts/ThematicBrowsingLayout';
import { CollectionsPrismicPageMeta } from '@weco/content/views/layouts/ThematicBrowsingLayout';

export type Props = {
  title: string;
  introText?: prismic.RichTextField;
  pageMeta: CollectionsPrismicPageMeta;
};

const WellcomeSubThemePage: NextPage<Props> & {
  getLayout?: (page: ReactElement<Props>) => ReactElement;
} = () => {
  return (
    <Container>
      <Space $v={{ size: 'md', properties: ['margin-top', 'margin-bottom'] }}>
        <p>sub-theme content</p>
      </Space>
    </Container>
  );
};

WellcomeSubThemePage.getLayout = page => {
  const { pageMeta, title, introText } = page.props;

  return (
    <ThematicBrowsingLayout
      title={title}
      description={pageMeta.description || pageDescriptions.collections.index}
      pageMeta={pageMeta}
      apiToolbarLinks={[createPrismicLink(pageMeta.prismicId)]}
      headerProps={{
        uiTitle: title,
        uiDescription: introText,
        extraBreadcrumbs: [
          { url: `/${prismicPageIds.collections}/subjects`, text: 'Subjects' },
        ],
      }}
    >
      {page}
    </ThematicBrowsingLayout>
  );
};

export default WellcomeSubThemePage;
