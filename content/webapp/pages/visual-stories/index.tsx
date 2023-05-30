import { getServerData } from '@weco/common/server-data';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';

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
      <div className="container">
        <h1>hi</h1>
        <p>This is for visual stories</p>
      </div>
    </PageLayout>
  );
};

export default VisualStory;
