import { getServerData } from '@weco/common/server-data';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import Space from '@weco/common/views/components/styled/Space';

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

const VisualStory = () => {
  return (
    <PageLayout
      title="Visual stories"
      description="TODO" // TODO
      url={{ pathname: '/visual-stories' }}
      jsonLd={[]}
      openGraphType="website"
      siteSection={null}
      hideNewsletterPromo={true}
    >
      <Space v={{ size: 'xl', properties: ['padding-bottom', 'padding-top'] }}>
        <div className="container">
          <h1 className="h1">Visual Stories prototypes</h1>
          <ul>
            <li>
              <a href="/visual-stories/v1">Version 1</a>
            </li>
            <li>
              <a href="/visual-stories/v2">Version 2</a>
            </li>
          </ul>
        </div>
      </Space>
    </PageLayout>
  );
};

export default VisualStory;
