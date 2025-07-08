import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import {
  ContaineredLayout,
  gridSize12,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import { Container } from '@weco/common/views/components/styled/Container';
import {
  GridCellScroll,
  GridScroll,
} from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import CardGrid from '@weco/content/views/components/CardGrid';
import FeaturedCard from '@weco/content/views/components/FeaturedCard';
import FeaturedText from '@weco/content/views/components/FeaturedText';
import { defaultSerializer } from '@weco/content/views/components/HTMLSerializers';
import SectionHeader from '@weco/content/views/components/SectionHeader';
import StoryPromo from '@weco/content/views/components/StoryPromo';
import { Article } from '@weco/content/services/wellcome/content/types/api';
import { SeriesBasic } from '@weco/content/types/series';
import { StoriesLanding } from '@weco/content/types/stories-landing';

export type Props = {
  articles: Article[];
  comicSeries: SeriesBasic[];
  storiesLanding: StoriesLanding;
  jsonLd: JsonLdObj[];
};

const ArticlesContainer = styled.div`
  background-color: ${props => props.theme.color('warmNeutral.300')};
`;

const StoryPromoContainer = styled(Container)`
  -webkit-overflow-scrolling: touch;

  /* former .container--scroll */
  ${props =>
    props.theme.mediaBetween(
      'small',
      'medium'
    )(`
    max-width: none;
    width: auto;
    overflow: auto;

    &::-webkit-scrollbar {
      height: 18px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 0;
      border-style: solid;
      border-width: 0 ${props.theme.containerPadding.small}px 12px;
      background: ${props.theme.color('neutral.400')};
    }
  `)}

  &::-webkit-scrollbar {
    background: ${props => props.theme.color('warmNeutral.300')};
  }

  &::-webkit-scrollbar-thumb {
    border-color: ${props => props.theme.color('warmNeutral.300')};
  }
`;

const StoriesPage: FunctionComponent<Props> = ({
  articles,
  comicSeries,
  jsonLd,
  storiesLanding,
}) => {
  const firstArticle = articles[0];
  const introText = storiesLanding?.introText;

  return (
    <PageLayout
      title="Stories"
      description={pageDescriptions.stories}
      url={{ pathname: '/stories' }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="stories"
      image={firstArticle && transformImage(firstArticle.image)}
      rssUrl="https://rss.wellcomecollection.org/stories"
      apiToolbarLinks={[createPrismicLink(storiesLanding.id)]}
    >
      <PageHeader
        breadcrumbs={getBreadcrumbItems('stories')}
        title="Stories"
        isContentTypeInfoBeforeMedia={false}
        sectionLevelPage={true}
      />
      {introText && (
        <ContaineredLayout gridSizes={gridSize8(false)}>
          <div className="body-text spaced-text">
            <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
              <FeaturedText
                html={introText}
                htmlSerializer={defaultSerializer}
              />
            </Space>
          </div>
        </ContaineredLayout>
      )}

      <SpacingSection>
        <ArticlesContainer className="row--has-wobbly-background">
          <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
            <ContaineredLayout gridSizes={gridSize12()}>
              <FeaturedCard
                type="article"
                article={firstArticle}
                background="neutral.700"
                textColor="white"
              />
            </ContaineredLayout>
          </Space>
          <div className="row__wobbly-background" />
          <StoryPromoContainer>
            <Space $v={{ size: 'l', properties: ['padding-bottom'] }}>
              <GridScroll className="card-theme card-theme--transparent">
                {articles.slice(1, 5).map(article => {
                  return (
                    <GridCellScroll
                      key={article.id}
                      $sizeMap={{ m: [6], l: [3], xl: [3] }}
                    >
                      <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
                        <StoryPromo variant="contentApi" article={article} />
                      </Space>
                    </GridCellScroll>
                  );
                })}
              </GridScroll>
            </Space>
          </StoryPromoContainer>
        </ArticlesContainer>
      </SpacingSection>

      <SpacingSection>
        {storiesLanding.storiesTitle && (
          <SpacingComponent>
            <SectionHeader
              title={`${storiesLanding.storiesTitle}`}
              gridSize={gridSize12()}
            />
          </SpacingComponent>
        )}
        {storiesLanding.storiesDescription && (
          <SpacingComponent>
            <ContaineredLayout gridSizes={gridSize12()}>
              <PrismicHtmlBlock html={storiesLanding.storiesDescription} />
            </ContaineredLayout>
          </SpacingComponent>
        )}
        <SpacingComponent>
          <CardGrid
            items={storiesLanding.stories}
            itemsPerRow={3}
            links={[{ text: 'More stories', url: '/search/stories' }]}
          />
        </SpacingComponent>
      </SpacingSection>

      <SpacingSection>
        <SpacingComponent>
          <SectionHeader title="Comics" gridSize={gridSize12()} />
        </SpacingComponent>

        <SpacingComponent>
          <ContaineredLayout gridSizes={gridSize12()}>
            <p>{pageDescriptions.comic}</p>
          </ContaineredLayout>
        </SpacingComponent>

        <SpacingComponent>
          <CardGrid
            items={comicSeries}
            itemsPerRow={3}
            itemsHaveTransparentBackground={true}
            links={[
              {
                text: 'More comics',
                url: '/search/stories?format=W7d_ghAAALWY3Ujc',
              },
            ]}
          />
        </SpacingComponent>
      </SpacingSection>

      <SpacingSection>
        {storiesLanding.booksTitle && (
          <SpacingComponent>
            <SectionHeader
              title={`${storiesLanding.booksTitle}`}
              gridSize={gridSize12()}
            />
          </SpacingComponent>
        )}
        {storiesLanding.booksDescription && (
          <SpacingComponent>
            <ContaineredLayout gridSizes={gridSize12()}>
              <PrismicHtmlBlock html={storiesLanding.booksDescription} />
            </ContaineredLayout>
          </SpacingComponent>
        )}
        <SpacingComponent>
          <CardGrid
            items={storiesLanding.books}
            itemsPerRow={3}
            links={[{ text: 'More books', url: '/books' }]}
          />
        </SpacingComponent>
      </SpacingSection>

      <SpacingSection>
        <SpacingComponent>
          <SectionHeader title="You may have missed" gridSize={gridSize12()} />
        </SpacingComponent>
        <SpacingComponent>
          <CardGrid
            items={articles.slice(5, 11)}
            itemsPerRow={3}
            links={[{ text: 'More stories', url: '/search/stories' }]}
          />
        </SpacingComponent>
      </SpacingSection>
    </PageLayout>
  );
};

export default StoriesPage;
