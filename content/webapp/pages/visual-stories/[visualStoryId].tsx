import { FunctionComponent } from 'react';
import { getServerData } from '@weco/common/server-data';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { createClient } from '@weco/content/services/prismic/fetch';
import {
  fetchVisualStory,
  fetchVisualStories,
} from '@weco/content/services/prismic/fetch/visual-stories';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { serialiseProps } from '@weco/common/utils/json';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import { transformVisualStory } from '@weco/content/services/prismic/transformers/visual-stories';
import ContentPage from '@weco/content/components/ContentPage/ContentPage';
import {
  VisualStory as VisualStoryProps,
  VisualStoryBasic,
} from '@weco/content/types/visual-stories';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { visualStoryLd } from '@weco/content/services/prismic/transformers/json-ld';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { Pageview } from '@weco/common/services/conversion/track';
import Body from '@weco/content/components/Body/Body';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { capitalize } from '@weco/common/utils/grammar';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import Standfirst from '@weco/common/views/slices/Standfirst';
import CardGrid from '@weco/content/components/CardGrid/CardGrid';
import Layout, { gridSize12 } from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import Divider from '@weco/common/views/components/Divider/Divider';
import { font } from '@weco/common/utils/classnames';
import {
  VisualStoriesDocument as RawVisualStoriesDocument,
  EventsDocumentData,
} from '@weco/common/prismicio-types';
import { isPast } from '@weco/common/utils/dates';
import {
  transformEventTimes,
  getLastEndTime,
} from '@weco/content/services/prismic/transformers/events';
import { isFilledLinkToDocument } from '@weco/common/services/prismic/types';

export const getOtherVisualStories = ({
  documentId,
  visualStories,
}: {
  documentId: string;
  visualStories: RawVisualStoriesDocument[];
}): RawVisualStoriesDocument[] => {
  return visualStories.filter(
    // We don't want to include a visual story among the related visual stories, if it is the one being displayed.
    // How do we know if it is the one being displayed?
    // Visual stories can be displayed at one of three urls
    // 1) https://wellcomecollection.org/visual-stories/{visual story id}
    // 2) https://wellcomecollection.org/exhibitions/{exhibition id}/visual-stories
    // 3) https://wellcomecollection.org/events/{event id}/visual-stories
    // We filter out a visual story if its id matches the visual story id in the url
    // OR if it is linked to the same exhibition id or event id in the url (we infer it is the same visual story)
    // We also filter our anything that is linked to a past exhibition or a past event
    result => {
      const relatedDocumentId =
        isFilledLinkToDocument(result.data.relatedDocument) &&
        result.data.relatedDocument.id;
      const exhibitionEndTime =
        isFilledLinkToDocument(result.data.relatedDocument) &&
        result.data.relatedDocument.data?.end
          ? result.data.relatedDocument.data?.end
          : undefined;
      const eventTimes =
        isFilledLinkToDocument(result.data.relatedDocument) &&
        result.data.relatedDocument.data?.times
          ? result.data.relatedDocument.data?.times
          : undefined;
      const transformedEventTimes =
        eventTimes && relatedDocumentId
          ? transformEventTimes(
              relatedDocumentId,
              eventTimes as EventsDocumentData['times']
            )
          : undefined;
      const lastEventEndTime = transformedEventTimes
        ? getLastEndTime(transformedEventTimes)
        : '';
      const endDateToUse = exhibitionEndTime || lastEventEndTime;

      const relatedIsPast = endDateToUse
        ? isPast(new Date(endDateToUse as string))
        : false;
      return (
        (!isFilledLinkToDocument(result.data.relatedDocument) &&
          documentId !== result.id) ||
        (isFilledLinkToDocument(result.data.relatedDocument) &&
          result.data.relatedDocument.id !== documentId &&
          !relatedIsPast)
      );
    }
  );
};

type Props = {
  visualStory: VisualStoryProps;
  visualStories: VisualStoryBasic[];
  jsonLd: JsonLdObj;
  pageview: Pageview;
};

export const returnVisualStoryProps = ({
  visualStoryDocument,
  otherCurrentVisualStories,
  serverData,
}: {
  visualStoryDocument?: RawVisualStoriesDocument;
  otherCurrentVisualStories?: RawVisualStoriesDocument[];

  serverData: SimplifiedServerData;
}) => {
  if (isNotUndefined(visualStoryDocument)) {
    const visualStory = transformVisualStory(visualStoryDocument);
    const visualStories = (
      (otherCurrentVisualStories &&
        otherCurrentVisualStories.map(transformVisualStory)) ||
      []
    )
      .map(story => {
        return {
          type: story.type,
          id: story.id,
          title: story.title,
          promo: story.promo,
          image: story.image,
          relatedDocument: story.relatedDocument,
        };
      })
      // put the things that aren't linked to events or exhibitions at the front
      .sort(
        (a, b) =>
          (a.relatedDocument ? Number.MAX_VALUE : 1) -
          (b.relatedDocument ? Number.MAX_VALUE : 1)
      );

    const jsonLd = visualStoryLd(visualStory);

    return {
      props: serialiseProps({
        visualStory,
        visualStories,
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
  const visualStoryQueryPromise = fetchVisualStory(client, visualStoryId);
  const visualStoriesQueryPromise = fetchVisualStories(client, {
    hasDelistFilter: false,
  });

  const [visualStoryQuery, visualStoriesQuery] = await Promise.all([
    visualStoryQueryPromise,
    visualStoriesQueryPromise,
  ]);

  const otherCurrentVisualStories = getOtherVisualStories({
    documentId: visualStoryId,
    visualStories: visualStoriesQuery.results,
  });

  return returnVisualStoryProps({
    visualStoryDocument: visualStoryQuery,
    otherCurrentVisualStories,
    serverData,
  });
};

const VisualStory: FunctionComponent<Props> = ({
  visualStory,
  visualStories,
  jsonLd,
}) => {
  const { relatedDocument } = visualStory;

  const ContentTypeInfo = visualStory.untransformedStandfirst ? (
    <Standfirst
      slice={visualStory.untransformedStandfirst}
      index={0}
      context={{}}
      slices={[]}
    />
  ) : null;

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

  const visualStoryPath = visualStory.relatedDocument?.id
    ? `/${visualStory.relatedDocument.type}/${visualStory.relatedDocument.uid}/visual-stories`
    : `/visual-stories/${visualStory.uid}`;

  const onThisPageLinks =
    visualStories.length > 0
      ? [
          ...visualStory.onThisPage,
          {
            text: 'More visual stories',
            url: '#more-visual-stories',
          },
        ]
      : visualStory.onThisPage;

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
            untransformedBody={visualStory.untransformedBody}
            pageId={visualStory.id}
            onThisPage={onThisPageLinks}
            showOnThisPage={visualStory.showOnThisPage}
            contentType="visual-story"
          />
        }
      />
      {visualStories.length > 0 && (
        <Space $v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}>
          <Layout gridSizes={gridSize12()}>
            <Divider lineColor="neutral.400" />
            <Space
              $v={{
                size: 'xl',
                properties: ['padding-top', 'padding-bottom'],
              }}
            >
              <h2 className={font('wb', 2)} id="more-visual-stories">
                More Visual Stories
              </h2>
            </Space>
          </Layout>
          <CardGrid items={visualStories} itemsPerRow={3} />
        </Space>
      )}
    </PageLayout>
  );
};

export default VisualStory;
