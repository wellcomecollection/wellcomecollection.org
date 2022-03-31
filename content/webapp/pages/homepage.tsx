import { FC } from 'react';
import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { ArticleBasic } from '../types/articles';
import { Page as PageType } from '../types/pages';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import Space from '@weco/common/views/components/styled/Space';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import SimpleCardGrid from '../components/SimpleCardGrid/SimpleCardGrid';
import PageHeaderStandfirst from '../components/PageHeaderStandfirst/PageHeaderStandfirst';
import {
  orderEventsByNextAvailableDate,
  filterEventsForNext7Days,
} from '../services/prismic/events';
import { ExhibitionBasic } from '../types/exhibitions';
import { EventBasic } from '../types/events';
import { convertItemToCardProps } from '../types/card';
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
import {
  transformArticle,
  transformArticleToArticleBasic,
} from '../services/prismic/transformers/articles';
import { homepageId } from '@weco/common/services/prismic/hardcoded-id';
import { fetchPage } from '../services/prismic/fetch/pages';
import { transformPage } from '../services/prismic/transformers/pages';
import { fetchEvents } from '../services/prismic/fetch/events';
import {
  fixEventDatesInJson,
  transformEvent,
  transformEventToEventBasic,
} from '../services/prismic/transformers/events';
import { pageDescriptions, homepageHeading } from '@weco/common/data/microcopy';
import { fetchExhibitions } from '../services/prismic/fetch/exhibitions';
import {
  fixExhibitionDatesInJson,
  transformExhibitionsQuery,
} from '../services/prismic/transformers/exhibitions';
import { ImageType } from '@weco/common/model/image';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { isContentList, isStandfirst } from 'types/body';

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
  exhibitions: PaginatedResults<ExhibitionBasic>;
  events: PaginatedResults<EventBasic>;
  articles: ArticleBasic[];
  page: PageType;
  jsonLd: JsonLdObj[];
};

const pageImage: ImageType = {
  contentUrl:
    'https://images.prismic.io/wellcomecollection/fc1e68b0528abbab8429d95afb5cfa4c74d40d52_tf_180516_2060224.jpg?auto=compress,format&w=800',
  width: 800,
  height: 450,
  alt: '',
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);

    const client = createClient(context);

    const articlesQueryPromise = fetchArticles(client, { pageSize: 4 });
    const eventsQueryPromise = fetchEvents(client, {
      period: 'current-and-coming-up',
    });
    const pagePromise = fetchPage(client, homepageId);
    const exhibitionsQueryPromise = fetchExhibitions(client, {
      period: 'next-seven-days',
      order: 'asc',
    });

    const [exhibitionsQuery, eventsQuery, articlesQuery, pageDocument] =
      await Promise.all([
        exhibitionsQueryPromise,
        eventsQueryPromise,
        articlesQueryPromise,
        pagePromise,
      ]);

    // The homepage should always exist in Prismic.
    const page = transformPage(pageDocument!);

    const articles = transformQuery(articlesQuery, transformArticle);
    const jsonLd = articles.results.map(articleLd);
    const basicArticles = articles.results.map(transformArticleToArticleBasic);

    const events = transformQuery(eventsQuery, event =>
      transformEventToEventBasic(transformEvent(event))
    );
    const exhibitions = transformExhibitionsQuery(exhibitionsQuery);

    if (events && exhibitions && articles && page) {
      return {
        props: removeUndefinedProps({
          articles: basicArticles,
          page,
          exhibitions,
          events,
          serverData,
          jsonLd,
        }),
      };
    } else {
      return { notFound: true };
    }
  };

const Homepage: FC<Props> = props => {
  const events = props.events.results.map(fixEventDatesInJson);
  const nextSevenDaysEvents = orderEventsByNextAvailableDate(
    filterEventsForNext7Days(events)
  );

  const exhibitions = props.exhibitions.results.map(fixExhibitionDatesInJson);

  const articles = props.articles;
  const page = props.page;
  const standFirst = page.body.find(isStandfirst);
  const lists = page.body.filter(isContentList);
  const headerList = lists.length === 2 ? lists[0] : null;
  const contentList = lists.length === 2 ? lists[1] : lists[0];

  return (
    <PageLayout
      title={''}
      description={pageDescriptions.homepage}
      url={{ pathname: '/' }}
      jsonLd={props.jsonLd}
      openGraphType={'website'}
      siteSection={null}
      image={pageImage}
    >
      <Layout10>
        <SpacingSection>
          <PageHeading>{homepageHeading}</PageHeading>
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
              items={headerList.value.items as any[]}
              isFeaturedFirst={true}
            />
          </SpacingComponent>
        </SpacingSection>
      )}

      {nextSevenDaysEvents.length + exhibitions.length > 2 && (
        <SpacingSection>
          <SpacingComponent>
            <SectionHeader title="This week" />
          </SpacingComponent>
          <SpacingComponent>
            <ExhibitionsAndEvents
              exhibitions={exhibitions}
              events={nextSevenDaysEvents as EventBasic[]}
              links={[{ text: 'All exhibitions and events', url: '/whats-on' }]}
            />
          </SpacingComponent>
        </SpacingSection>
      )}

      {contentList && (
        <SpacingSection>
          <SpacingComponent>
            <SectionHeader title={contentList.value.title || ''} />
          </SpacingComponent>
          <SpacingComponent>
            <SimpleCardGrid
              items={
                contentList.value.items.map(item => {
                  if (item.type === 'seasons') {
                    return convertItemToCardProps(item);
                  } else {
                    return item;
                  }
                }) as any[]
              }
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
            items={articles}
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
