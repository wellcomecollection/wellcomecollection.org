import { FunctionComponent } from 'react';
import NewsletterSignup from '@weco/content/components/NewsletterSignup/NewsletterSignup';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import Space from '@weco/common/views/components/styled/Space';
import { GetServerSideProps } from 'next';
import { AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { newsletterDescription } from '@weco/common/data/microcopy';
import { landingHeaderBackgroundLs } from '@weco/common/utils/backgrounds';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
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
      siteSection="what-we-do"
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
          <Layout8>
            <NewsletterSignup
              isSuccess={result === 'success'}
              isError={result === 'error'}
              isConfirmed={result === 'confirmed'}
            />
          </Layout8>
        </Space>
      </Space>
    </PageLayout>
  );
};

export default Newsletter;
