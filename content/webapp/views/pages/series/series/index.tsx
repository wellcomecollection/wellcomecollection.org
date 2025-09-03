import { NextPage } from 'next';
import styled from 'styled-components';

import { SimplifiedServerData } from '@weco/common/server-data/types';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import HeaderBackground from '@weco/common/views/components/HeaderBackground';
import PageHeader from '@weco/common/views/components/PageHeader';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import Standfirst from '@weco/common/views/slices/Standfirst';
import { ArticleScheduleItem } from '@weco/content/types/article-schedule-items';
import { ArticleBasic } from '@weco/content/types/articles';
import { Series } from '@weco/content/types/series';
import { getFeaturedMedia } from '@weco/content/utils/page-header';
import ArticleCard from '@weco/content/views/components/ArticleCard';
import Body from '@weco/content/views/components/Body';
import ContentPage from '@weco/content/views/components/ContentPage';
import Pagination from '@weco/content/views/components/Pagination';

import ArticleScheduleItemCard from './series.ArticleScheduleItemCard';

const SeriesItem = styled.div<{ $isFirst: boolean }>`
  border-top: ${props =>
    `${props.$isFirst ? '0' : '1px'} solid ${props.theme.color(
      'warmNeutral.400'
    )}`};
`;

export type Props = {
  series: Series;
  articles: PaginatedResults<ArticleBasic>;
  scheduledItems: ArticleScheduleItem[];
  serverData: SimplifiedServerData;
};

const ArticleSeriesPage: NextPage<Props> = props => {
  const { series, articles, scheduledItems, serverData } = props;
  const breadcrumbs = {
    items: [
      {
        url: '/stories',
        text: 'Stories',
      },
      {
        url: linkResolver(series),
        text: series.title,
        isHidden: true,
      },
    ],
  };

  const ContentTypeInfo = series.untransformedStandfirst ? (
    <Standfirst
      slice={series.untransformedStandfirst}
      index={0}
      context={{}}
      slices={[]}
    />
  ) : null;

  const FeaturedMedia = getFeaturedMedia(series);
  const Header = (
    <PageHeader
      variant="basic"
      breadcrumbs={breadcrumbs}
      labels={{ labels: series.labels }}
      title={series.title}
      ContentTypeInfo={ContentTypeInfo}
      Background={
        <HeaderBackground
          hasWobblyEdge={true}
          backgroundTexture={headerBackgroundLs}
        />
      }
      FeaturedMedia={FeaturedMedia}
      isContentTypeInfoBeforeMedia={true}
    />
  );

  return (
    <PageLayout
      title={series.title}
      description={series.metadataDescription || series.promo?.caption || ''}
      url={{ pathname: `/series/${series.uid}` }}
      jsonLd={{ '@type': 'WebPage' }}
      siteSection="stories"
      openGraphType="website"
      image={series.image}
      apiToolbarLinks={[createPrismicLink(series.id)]}
    >
      <ContentPage
        id={series.id}
        serverData={serverData}
        Header={Header}
        Body={
          <Body
            untransformedBody={series.untransformedBody}
            pageId={series.id}
          />
        }
        contributors={series.contributors}
        seasons={series.seasons}
      >
        <>
          {articles.results.map((article, index) => (
            <SeriesItem key={index} $isFirst={index === 0}>
              <ArticleCard
                article={article}
                showPosition={true}
                xOfY={{
                  x: index + 1,
                  y: articles.results.length + scheduledItems.length,
                }}
              />
            </SeriesItem>
          ))}
          {scheduledItems.map((item, index) => (
            <SeriesItem key={index} $isFirst={false}>
              <ArticleScheduleItemCard
                item={item}
                xOfY={{
                  x: articles.results.length + index + 1,
                  y: articles.results.length + scheduledItems.length,
                }}
              />
            </SeriesItem>
          ))}
        </>
        {articles.totalPages > 1 && (
          <PaginationWrapper $verticalSpacing="m" $alignRight>
            <Pagination
              totalPages={articles.totalPages}
              ariaLabel="Series pagination"
            />
          </PaginationWrapper>
        )}
      </ContentPage>
    </PageLayout>
  );
};

export default ArticleSeriesPage;
