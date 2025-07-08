import { FunctionComponent } from 'react';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import { capitalize } from '@weco/common/utils/grammar';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import Divider from '@weco/common/views/components/Divider';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/components/PageLayout';
import Space from '@weco/common/views/components/styled/Space';
import Standfirst from '@weco/common/views/slices/Standfirst';
import Body from '@weco/content/views/components/Body';
import CardGrid from '@weco/content/views/components/CardGrid';
import ContentPage from '@weco/content/views/components/ContentPage';
import {
  VisualStoryBasic,
  VisualStory as VisualStoryProps,
} from '@weco/content/types/visual-stories';

export type Props = {
  visualStory: VisualStoryProps;
  visualStories: VisualStoryBasic[];
  jsonLd: JsonLdObj;
};

const VisualStoryPage: FunctionComponent<Props> = ({
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
                  url: linkResolver(relatedDocument),
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

  // Related document UIDs are optional, so if that's the case, use ID as plan B
  const visualStoryPath = visualStory.relatedDocument?.id
    ? `/${visualStory.relatedDocument.type}/${visualStory.relatedDocument.uid || visualStory.relatedDocument.id}/visual-stories`
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
      apiToolbarLinks={[createPrismicLink(visualStory.id)]}
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
          <ContaineredLayout gridSizes={gridSize12()}>
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
          </ContaineredLayout>
          <CardGrid items={visualStories} itemsPerRow={3} />
        </Space>
      )}
    </PageLayout>
  );
};

export default VisualStoryPage;
