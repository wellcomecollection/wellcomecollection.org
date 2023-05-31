import { getServerData } from '@weco/common/server-data';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import Space from '@weco/common/views/components/styled/Space';
import { V2Prototype } from '@weco/content/components/VisualStories';

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

const VisualStoryV2 = () => {
  return (
    <PageLayout
      title="Visual stories - V2"
      description="TODO" // TODO
      url={{ pathname: '/visual-stories/v2' }}
      jsonLd={[]}
      openGraphType="website"
      siteSection={null}
      hideNewsletterPromo={true}
    >
      <Space v={{ size: 'xl', properties: ['padding-bottom', 'padding-top'] }}>
        <div className="container">
          <V2Prototype />
        </div>
      </Space>
    </PageLayout>
  );
};

export default VisualStoryV2;
