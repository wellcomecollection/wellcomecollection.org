import { FunctionComponent } from 'react';
import { getServerData } from '@weco/common/server-data';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchVisualStory } from '@weco/content/services/prismic/fetch/visual-stories';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { serialiseProps } from '@weco/common/utils/json';
import { setCacheControl } from '@weco/common/utils/setCacheControl';
import { transformVisualStory } from '@weco/content/services/prismic/transformers/visual-stories';
import ContentPage from '@weco/content/components/ContentPage/ContentPage';
import { VisualStory } from '@weco/content/types/visual-stories';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import PageHeaderStandfirst from '@weco/content/components/PageHeaderStandfirst/PageHeaderStandfirst';

import Body from '@weco/content/components/Body/Body';

type Props = {
  visualStory: VisualStory;
};

export const getServerSideProps = async context => {
  setCacheControl(context.res);
  const client = createClient(context);
  const { visualStoryId } = context.query;
  const serverData = await getServerData(context);

  if (!serverData?.toggles?.visualStories) {
    return { notFound: true };
  }

  if (!looksLikePrismicId(visualStoryId)) {
    return { notFound: true };
  }

  const visualStoryDocument = await fetchVisualStory(client, visualStoryId);
  if (visualStoryDocument) {
    const visualStory = transformVisualStory(visualStoryDocument);
    return {
      props: serialiseProps({
        visualStory,
        serverData,
      }),
    };
  } else {
    return { notFound: true };
  }
};

const VisualStory: FunctionComponent<Props> = ({ visualStory }) => {
  const ContentTypeInfo = visualStory.standfirst && (
    <PageHeaderStandfirst html={visualStory.standfirst} />
  );
  const Header = (
    <PageHeader
      breadcrumbs={{ items: [] }}
      labels={{ labels: [] }}
      title={visualStory.title}
      isContentTypeInfoBeforeMedia={true}
      ContentTypeInfo={ContentTypeInfo}
    />
  );

  return (
    <PageLayout
      title="Visual stories"
      description="TODO" // TODO
      url={{ pathname: '/visual-stories' }}
      jsonLd={[]}
      openGraphType="website"
      hideNewsletterPromo={true}
    >
      <ContentPage
        id={visualStory.id}
        Header={Header}
        Body={
          <Body
            body={visualStory.body}
            pageId={visualStory.id}
            onThisPage={visualStory.onThisPage}
            showOnThisPage={visualStory.showOnThisPage}
          />
        }
        contributors={visualStory.contributors}
      />
    </PageLayout>
  );
};

export default VisualStory;
