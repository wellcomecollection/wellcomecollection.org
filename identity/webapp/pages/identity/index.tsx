import { NextPage } from 'next';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import Label from '@weco/common/views/components/Label/Label';
import Login from '@weco/common/views/components/oauth/Login';

const IndexPage: NextPage = () => {
  return (
    <PageLayout
      title="Identity"
      description="Wellcome Collection login"
      url={{
        pathname: '/',
        query: {},
      }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType={'website'}
      siteSection={'identity'}
      imageUrl={undefined}
      imageAltText={undefined}
      globalContextData={{
        toggles: {},
        globalAlert: undefined,
        popupDialog: undefined,
        openingTimes: undefined,
      }}
    >
      <Label label={{ text: 'identify' }} />
      <Login text="Login" />
    </PageLayout>
  );
};

export default IndexPage;
