import { getServerData } from '@weco/common/server-data';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import Space from '@weco/common/views/components/styled/Space';
import { V1Prototype } from '@weco/content/components/VisualStories';

export const getServerSideProps = async context => {
  const serverData = await getServerData(context);

  if (!serverData?.toggles?.visualStories) {
    return { notFound: true };
  }

  return {
    props: {
      serverData,
    },
  };
};

const VisualStoryV1 = () => {
  return (
    <PageLayout
      title="Visual stories - V1"
      description="TODO"
      url={{ pathname: '/visual-stories/v1' }}
      jsonLd={[]}
      openGraphType="website"
      hideNewsletterPromo={true}
    >
      <Space v={{ size: 'xl', properties: ['padding-bottom', 'padding-top'] }}>
        <V1Prototype />
      </Space>
    </PageLayout>
  );
};

export default VisualStoryV1;
