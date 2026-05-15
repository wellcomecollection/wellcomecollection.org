import styled from 'styled-components';

import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { gridSize12 } from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { transformContentListSlice } from '@weco/content/services/prismic/transformers/body';
import { ArticleBasic } from '@weco/content/types/articles';
import { isContentList } from '@weco/content/types/body';
import { convertItemToCardProps } from '@weco/content/types/card';
import { Page } from '@weco/content/types/pages';
import { SeriesBasic } from '@weco/content/types/series';
import Card from '@weco/content/views/components/Card';
import SectionHeader from '@weco/content/views/components/SectionHeader';
import StoryCard from '@weco/content/views/components/StoryCard';

export type Props = {
  page: Page;
  hardCodedSeries: SeriesBasic[];
};

const CardGridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.spacingUnit * 4}px;
`;

type StorySectionProps = {
  title: string;
  articles: ArticleBasic[];
};

const StorySection = ({ title, articles }: StorySectionProps) => {
  if (articles.length === 0) return null;

  return (
    <Space $v={{ size: 'xl', properties: ['padding-bottom'] }}>
      <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
        <SectionHeader title={title} gridSize={gridSize12()} />
      </Space>

      <Container>
        <SpacingComponent>
          <CardGridWrapper>
            {articles.map(article => (
              <StoryCard
                key={article.id}
                variant="prismic"
                article={article}
                showAllLabels
              />
            ))}
          </CardGridWrapper>
        </SpacingComponent>
      </Container>
    </Space>
  );
};

const KioskStoriesListingPage = ({ page, hardCodedSeries }: Props) => {
  const introText = page.introText;
  const contentLists = page.untransformedBody
    .filter(isContentList)
    .map(transformContentListSlice)
    .slice(0, 2);

  return (
    <PageLayout
      openGraphType={'website' as const}
      jsonLd={[]}
      siteSection="stories"
      title={page.title}
      description={page.metadataDescription || page.promo?.caption || ''}
      url={{ pathname: '/stories/kiosk' }}
      image={page.image}
      apiToolbarLinks={[createPrismicLink(page.id)]}
      clipOverflowX
      hideNewsletterPromo
      hideFooter
      hideHeader
      isNoIndex
    >
      <PageHeader variant="landing" title={page.title} introText={introText} />

      <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
        {contentLists[0] && (
          <StorySection
            title={contentLists[0].value.title || ''}
            articles={contentLists[0].value.items.filter(
              (item): item is ArticleBasic => item.type === 'articles'
            )}
          />
        )}

        {hardCodedSeries.length > 0 && (
          <SpacingSection>
            <SpacingComponent>
              <SectionHeader title="Series" gridSize={gridSize12()} />
            </SpacingComponent>

            <SpacingComponent>
              <Container>
                <CardGridWrapper>
                  {hardCodedSeries.map(series => (
                    <Card
                      key={series.id}
                      item={convertItemToCardProps(series)}
                    />
                  ))}
                </CardGridWrapper>
              </Container>
            </SpacingComponent>
          </SpacingSection>
        )}

        {contentLists[1] && (
          <StorySection
            title={contentLists[1].value.title || ''}
            articles={contentLists[1].value.items.filter(
              (item): item is ArticleBasic => item.type === 'articles'
            )}
          />
        )}
      </Space>
    </PageLayout>
  );
};

export default KioskStoriesListingPage;
