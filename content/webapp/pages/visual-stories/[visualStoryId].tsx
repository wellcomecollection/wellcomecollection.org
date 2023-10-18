import { FunctionComponent } from 'react';
import { getServerData } from '@weco/common/server-data';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchVisualStory } from '@weco/content/services/prismic/fetch/visual-stories';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { serialiseProps } from '@weco/common/utils/json';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { transformVisualStory } from '@weco/content/services/prismic/transformers/visual-stories';
import ContentPage from '@weco/content/components/ContentPage/ContentPage';
import { VisualStory } from '@weco/content/types/visual-stories';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst/PageHeaderStandfirst';
import { visualStoryLd } from '@weco/content/services/prismic/transformers/json-ld';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { Pageview } from '@weco/common/services/conversion/track';
import Body from '@weco/content/components/Body/Body';
import { VisualStoryDocument } from '@weco/content/services/prismic/types/visual-stories';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { capitalize } from '@weco/common/utils/grammar';

type Props = {
  visualStory: VisualStory;
  jsonLd: JsonLdObj;
  pageview: Pageview;
};

export const returnVisualStoryProps = ({
  visualStoryDocument,
  serverData,
}: {
  visualStoryDocument?: VisualStoryDocument;
  serverData: SimplifiedServerData;
}) => {
  if (visualStoryDocument) {
    const visualStory = transformVisualStory(visualStoryDocument);
    const jsonLd = visualStoryLd(visualStory);

    return {
      props: serialiseProps({
        visualStory,
        serverData,
        jsonLd,
        pageview: {
          name: 'visual-story',
          properties: {},
        },
      }),
    };
  } else {
    return { notFound: true };
  }
};

export const getServerSideProps = async context => {
  setCacheControl(context.res);
  const client = createClient(context);
  const { visualStoryId } = context.query;
  const serverData = await getServerData(context);

  if (!looksLikePrismicId(visualStoryId)) {
    return { notFound: true };
  }

  const visualStoryDocument = await fetchVisualStory(client, visualStoryId);

  // We want to check if the VS belongs to an event or an exhibition
  // If so, it should be redirected immediately
  if (
    visualStoryDocument?.data['related-document'] &&
    'id' in visualStoryDocument.data['related-document']
  ) {
    const { type, id } = visualStoryDocument.data['related-document'];

    return {
      redirect: {
        permanent: true,
        destination: `/${type}/${id}/visual-stories`,
      },
    };
  }

  return returnVisualStoryProps({ visualStoryDocument, serverData });
};

const VisualStory: FunctionComponent<Props> = ({ visualStory, jsonLd }) => {
  const { relatedDocument } = visualStory;

  const ContentTypeInfo = visualStory.standfirst && (
    <PageHeaderStandfirst html={visualStory.standfirst} />
  );

  const Header = (
    <PageHeader
      breadcrumbs={{
        items:
          relatedDocument && relatedDocument.title
            ? [
                {
                  text: `${capitalize(relatedDocument.type as string)}`,
                  url: `/${relatedDocument.type}`,
                },
                {
                  text: relatedDocument.title,
                  url: `/${relatedDocument.type}/${relatedDocument.id}`,
                },
              ]
            : [],
      }}
      labels={{ labels: [] }}
      title={visualStory.title}
      isContentTypeInfoBeforeMedia={true}
      ContentTypeInfo={ContentTypeInfo}
    />
  );

  return (
    <PageLayout
      title={visualStory.title}
      description={visualStory.promo?.caption || ''}
      url={{ pathname: `/visual-stories/${visualStory.id}` }}
      jsonLd={jsonLd}
      openGraphType="website"
      hideNewsletterPromo={true}
      siteSection={visualStory.siteSection}
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
            contentType="visual-story"
          />
        }
      />
    </PageLayout>
  );
};

export default VisualStory;
