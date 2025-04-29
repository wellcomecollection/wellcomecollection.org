import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { newsletterDescription } from '@weco/common/data/microcopy';
import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/services/app';
import { landingHeaderBackgroundLs } from '@weco/common/utils/backgrounds';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ContaineredLayout,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/components/PageLayout';
import Space from '@weco/common/views/components/styled/Space';
import NewsletterSignup from '@weco/content/components/NewsletterSignup';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

type Props = {
  result?: string;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);
  const { result } = context.query;

  return {
    props: serialiseProps({
      result: result ? result.toString() : undefined,
      serverData,
    }),
  };
};

const Newsletter: FunctionComponent<Props> = ({ result }) => {
  return (
    <PageLayout
      title="Sign up to our newsletter"
      description={newsletterDescription}
      hideNewsletterPromo={true}
      url={{ pathname: '/newsletter' }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      image={{
        contentUrl:
          'https://iiif.wellcomecollection.org/image/V0019283.jpg/full/800,/0/default.jpg',
        width: 800,
        height: 662,
        alt: '',
      }}
    >
      <PageHeader
        breadcrumbs={{ items: [] }}
        title="Newsletters"
        backgroundTexture={landingHeaderBackgroundLs}
        highlightHeading={true}
      />

      <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
        <Space $v={{ size: 'xl', properties: ['padding-bottom'] }}>
          <ContaineredLayout gridSizes={gridSize8()}>
            <NewsletterSignup
              isSuccess={result === 'success'}
              isError={result === 'error'}
              isConfirmed={result === 'confirmed'}
            />
          </ContaineredLayout>
        </Space>
      </Space>
    </PageLayout>
  );
};

export default Newsletter;
