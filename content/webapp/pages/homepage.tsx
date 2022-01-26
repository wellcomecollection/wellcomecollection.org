import { FC } from 'react';
import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';
import { getPage } from '@weco/common/services/prismic/pages';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { Article } from '@weco/common/model/articles';
import { Page as PageType } from '@weco/common/model/pages';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import Space from '@weco/common/views/components/styled/Space';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import SimpleCardGrid from '../components/SimpleCardGrid/SimpleCardGrid';
import PageHeaderStandfirst from '../components/PageHeaderStandfirst/PageHeaderStandfirst';
import { getExhibitions } from '@weco/common/services/prismic/exhibitions';
import { getEvents } from '@weco/common/services/prismic/events';
import {
  orderEventsByNextAvailableDate,
  filterEventsForNext7Days,
} from '../services/prismic/events';
import { UiExhibition } from '@weco/common/model/exhibitions';
import { UiEvent } from '@weco/common/model/events';
import { convertJsonToDates } from './event';
import { convertItemToCardProps } from '@weco/common/model/card';
import { GetServerSideProps } from 'next';
import { AppErrorProps } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import ExhibitionsAndEvents from '../components/ExhibitionsAndEvents/ExhibitionsAndEvents';
import CardGrid from '../components/CardGrid/CardGrid';
import { articleLd } from '../services/prismic/transformers/json-ld';
import { createClient } from '../services/prismic/fetch';
import { fetchArticles } from '../services/prismic/fetch/articles';
import { transformQuery } from '../services/prismic/transformers/paginated-results';
import { transformArticle } from '../services/prismic/transformers/articles';
import { homepageId } from '@weco/common/services/prismic/hardcoded-id';

const PageHeading = styled(Space).attrs({
  as: 'h1',
  v: {
    size: 'l',
    properties: ['margin-top', 'margin-bottom'],
  },
  className: classNames({
    [font('wb', 1)]: true,
  }),
})``;

const CreamBox = styled(Space).attrs({
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background: ${props => props.theme.color('cream')};
`;

type Props = {
  exhibitions: PaginatedResults<UiExhibition>;
  events: PaginatedResults<UiEvent>;
  articles: PaginatedResults<Article>;
  page: PageType;
};

const pageDescription =
  'Visit our free museum and library in central London connecting science, medicine, life and art. Explore our exhibitions, live events, gallery tours, restaurant, cafe, bookshop, and cafe. Fully accessible. Open late on Thursday evenings.';

const pageImage =
  'https://images.prismic.io/wellcomecollection/fc1e68b0528abbab8429d95afb5cfa4c74d40d52_tf_180516_2060224.jpg?auto=compress,format&w=800';

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const { memoizedPrismic } = context.query;

    const client = createClient(context);

    const articlesQueryPromise = fetchArticles(client, { pageSize: 4 });

    const exhibitionsPromise = getExhibitions(
      context.req,
      {
        period: 'next-seven-days',
        order: 'asc',
      },
      memoizedPrismic
    );
    const eventsPromise = getEvents(
      context.req,
      {
        period: 'current-and-coming-up',
      },
      memoizedPrismic
    );
    const pagePromise = getPage(context.req, homepageId, memoizedPrismic);
    const [exhibitions, events, articlesQuery, page] = await Promise.all([
      exhibitionsPromise,
      eventsPromise,
      articlesQueryPromise,
      pagePromise,
    ]);

    const articles = transformQuery(articlesQuery, transformArticle);

    if (events && exhibitions && articles && page) {
      return {
        props: removeUndefinedProps({
          articles,
          page,
          exhibitions,
          events,
          serverData,
        }),
      };
    } else {
      return { notFound: true };
    }
  };

const Homepage: FC<Props> = props => {
  const events = props.events.results.map(convertJsonToDates);
  const nextSevenDaysEvents = orderEventsByNextAvailableDate(
    filterEventsForNext7Days(events)
  );
  const exhibitions = props.exhibitions.results.map(exhibition => {
    return {
      ...exhibition,
      start: exhibition.start && new Date(exhibition.start),
      end: exhibition.end && new Date(exhibition.end),
    };
  });
  const articles = props.articles;
  const page = props.page;
  const standFirst = page.body.find(slice => slice.type === 'standfirst');
  const lists = page.body.filter(slice => slice.type === 'contentList');
  const headerList = lists.length === 2 ? lists[0] : null;
  const contentList = lists.length === 2 ? lists[1] : lists[0];

  return (
    <PageLayout
      title={''}
      description={pageDescription}
      url={{ pathname: '/' }}
      jsonLd={[...articles.results.map(articleLd)]}
      openGraphType={'website'}
      siteSection={null}
      imageUrl={pageImage}
      imageAltText={''}
    >
      <Layout10>
        <SpacingSection>
          <PageHeading>
            A free museum and library exploring health and human experience
          </PageHeading>
          {standFirst && (
            <CreamBox>
              <PageHeaderStandfirst html={standFirst.value} />
            </CreamBox>
          )}
        </SpacingSection>
      </Layout10>
      {headerList && (
        <SpacingSection>
          {headerList.value.title && (
            <SpacingComponent>
              <SectionHeader title={headerList.value.title} />
            </SpacingComponent>
          )}
          <SpacingComponent>
            <SimpleCardGrid
              items={headerList.value.items}
              isFeaturedFirst={true}
            />
          </SpacingComponent>
        </SpacingSection>
      )}

      {(nextSevenDaysEvents.length + exhibitions.length) > 2 && (
        <SpacingSection>
          <SpacingComponent>
            <SectionHeader title="This week" />
          </SpacingComponent>
          <SpacingComponent>
            <ExhibitionsAndEvents
              exhibitions={exhibitions}
              events={nextSevenDaysEvents}
              links={[{ text: 'All exhibitions and events', url: '/whats-on' }]}
            />
          </SpacingComponent>
        </SpacingSection>
      )}

      {contentList && (
        <SpacingSection>
          <SpacingComponent>
            <SectionHeader title={contentList.value.title} />
          </SpacingComponent>
          <SpacingComponent>
            <SimpleCardGrid
              items={contentList.value.items.map(item => {
                if (item.type === 'seasons') {
                  return convertItemToCardProps(item);
                } else {
                  return item;
                }
              })}
            />
          </SpacingComponent>
        </SpacingSection>
      )}

      <SpacingSection>
        <SpacingComponent>
          <SectionHeader title="Latest stories" />
        </SpacingComponent>
        <SpacingComponent>
          <CardGrid
            items={articles.results}
            itemsPerRow={4}
            itemsHaveTransparentBackground={true}
            links={[{ text: 'All stories', url: '/stories' }]}
          />
        </SpacingComponent>
      </SpacingSection>
    </PageLayout>
  );
};

export default Homepage;
