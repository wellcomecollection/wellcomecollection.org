import * as prismic from '@prismicio/client';
import { NextPage } from 'next';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { pageDescriptions } from '@weco/common/data/microcopy';
import { ImageType } from '@weco/common/model/image';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { ThematicBrowsingHeader } from '@weco/content/views/layouts/ThematicBrowsingLayout';

export type Props = {
  pageMeta: {
    id: string;
    uid: string;
    image?: ImageType;
    description?: string;
  };
  title: string;
  introText?: prismic.RichTextField;
};

const WellcomeSubThemePage: NextPage<Props> = ({
  pageMeta,
  title,
  introText,
}) => {
  return (
    <PageLayout
      title="Collections"
      description={pageMeta.description || pageDescriptions.collections.index}
      url={{
        pathname: `${prismicPageIds.collections}/subjects/${pageMeta.uid}`,
      }}
      jsonLd={[]}
      openGraphType="website"
      siteSection="collections"
      image={pageMeta.image}
      apiToolbarLinks={[createPrismicLink(pageMeta.id)]}
      hideNewsletterPromo
    >
      <ThematicBrowsingHeader
        uiTitle={title}
        currentCategory="subjects"
        uiDescription={introText}
        extraBreadcrumbs={[
          { url: `/${prismicPageIds.collections}/subjects`, text: 'Subjects' },
        ]}
      />

      <Container>
        <Space $v={{ size: 'md', properties: ['margin-top', 'margin-bottom'] }}>
          <p>sub-theme content</p>
        </Space>
      </Container>
    </PageLayout>
  );
};
export default WellcomeSubThemePage;
