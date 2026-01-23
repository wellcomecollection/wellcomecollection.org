import * as prismic from '@prismicio/client';
import { NextPage } from 'next';

import { ImageType } from '@weco/common/model/image';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/layouts/PageLayout';

export type Props = {
  pageMeta: {
    id: string;
    image?: ImageType;
    description?: string;
  };
  title: string;
  introText: prismic.RichTextField;
};

const WellcomeSubThemePage: NextPage<Props> = ({
  pageMeta,
  title,
  introText,
}) => {
  return (
    <PageLayout
      title={title}
      description={pageMeta.description || ''}
      url={{ pathname: `/collections/subjects/${pageMeta.id}` }}
      jsonLd={[]}
      openGraphType="website"
      siteSection="collections"
      image={pageMeta.image}
      apiToolbarLinks={[createPrismicLink(pageMeta.id)]}
    >
      <PageHeader variant="landing" title={title} introText={introText} />
    </PageLayout>
  );
};

export default WellcomeSubThemePage;
