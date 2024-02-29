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
import { isNotUndefined } from '@weco/common/utils/type-guards';

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
  if (isNotUndefined(visualStoryDocument)) {
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
  }

  return { notFound: true };
};

export const getServerSideProps = async context => {
  setCacheControl(context.res);
  const { visualStoryId } = context.query;

  if (!looksLikePrismicId(visualStoryId)) {
    return { notFound: true };
  }

  const serverData = await getServerData(context);
  const client = createClient(context);
  const visualStoryDocument = await fetchVisualStory(client, visualStoryId);

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

  // Ensures the canonical link points the the desired URL should there be a related Event or Exhibition
  const visualStoryPath = visualStory.relatedDocument?.id
    ? `/${visualStory.relatedDocument.type}/${visualStory.relatedDocument.id}/visual-stories`
    : `/visual-stories/${visualStory.id}`;

  return (
    <PageLayout
      title={visualStory.title}
      description={visualStory.promo?.caption || ''}
      url={{ pathname: visualStoryPath }}
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
            originalBody={visualStory.originalBody}
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
