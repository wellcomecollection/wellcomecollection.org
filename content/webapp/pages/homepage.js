// @flow
import type { Context } from 'next';
import { Component } from 'react';
import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';
import { getArticles } from '@weco/common/services/prismic/articles';
import { articleLd } from '@weco/common/utils/json-ld';
import { getPage } from '@weco/common/services/prismic/pages';
import CardGrid from '@weco/common/views/components/CardGrid/CardGrid';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import PageLayout from '@weco/common/views/components/PageLayoutDeprecated/PageLayoutDeprecated';
import { type Article } from '@weco/common/model/articles';
import type { Page as PageType } from '@weco/common/model/pages';
import { type PaginatedResults } from '@weco/common/services/prismic/types';
import Space from '@weco/common/views/components/styled/Space';
// $FlowFixMe (tsx)
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import SimpleCardGrid from '@weco/common/views/components/SimpleCardGrid/SimpleCardGrid';
import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst/PageHeaderStandfirst';
// $FlowFixMe (tsx)
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import ExhibitionsAndEvents from '@weco/common/views/components/ExhibitionsAndEvents/ExhibitionsAndEvents';
import { getExhibitions } from '@weco/common/services/prismic/exhibitions';
import {
  getEvents,
  orderEventsByNextAvailableDate,
  filterEventsForNext7Days,
} from '@weco/common/services/prismic/events';
import { type UiExhibition } from '@weco/common/model/exhibitions';
import { type UiEvent } from '@weco/common/model/events';
import { convertJsonToDates } from './event';

const PageHeading = styled(Space).attrs({
  as: 'h1',
  v: {
    size: 'l',
    properties: ['margin-top', 'margin-bottom'],
  },
  className: classNames({
    'no-margin': true,
    [font('wb', 1)]: true,
  }),
})``;

const CreamBox = styled(Space).attrs({
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background: ${props => props.theme.color('cream')};
`;

type Props = {|
  exhibitions: PaginatedResults<UiExhibition>,
  events: PaginatedResults<UiEvent>,
  articles: PaginatedResults<Article>,
  page: PageType,
|};

const pageDescription =
  'Visit our free museum and library in central London connecting science, medicine, life and art. Explore our exhibitions, live events, gallery tours, restaurant, cafe, bookshop, and cafe. Fully accessible. Open late on Thursday evenings.';
const pageImage =
  'https://images.prismic.io/wellcomecollection/fc1e68b0528abbab8429d95afb5cfa4c74d40d52_tf_180516_2060224.jpg?auto=compress,format&w=800';
export class HomePage extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const { id, memoizedPrismic } = ctx.query;
    const articlesPromise = await getArticles(
      ctx.req,
      { pageSize: 4 },
      memoizedPrismic
    );
    const exhibitionsPromise = getExhibitions(
      ctx.req,
      {
        period: 'next-seven-days',
        order: 'asc',
      },
      memoizedPrismic
    );
    const eventsPromise = getEvents(
      ctx.req,
      {
        period: 'current-and-coming-up',
      },
      memoizedPrismic
    );
    const pagePromise = await getPage(ctx.req, id, memoizedPrismic);
    const [exhibitions, events, articles, page] = await Promise.all([
      exhibitionsPromise,
      eventsPromise,
      articlesPromise,
      pagePromise,
    ]);

    if (events && exhibitions && articles && page) {
      return {
        articles,
        page,
        exhibitions,
        events,
      };
    } else {
      return { statusCode: 404 };
    }
  };

  render() {
    const events = this.props.events.results.map(convertJsonToDates);
    const nextSevenDaysEvents = orderEventsByNextAvailableDate(
      filterEventsForNext7Days(events)
    );
    const exhibitions = this.props.exhibitions.results.map(exhibition => {
      return {
        start: exhibition.start && new Date(exhibition.start),
        end: exhibition.end && new Date(exhibition.end),
        ...exhibition,
      };
    });
    const articles = this.props.articles;
    const page = this.props.page;
    const standFirst = page.body.find(slice => slice.type === 'standfirst');
    const lists = page.body.filter(slice => slice.type === 'contentList');
    const reopeningList = lists.length === 2 ? lists[0] : null;
    const contentList = lists.length === 2 ? lists[1] : lists[0];

    return (
      <PageLayout
        title={''}
        description={pageDescription}
        url={'/'}
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
            <TogglesContext.Consumer>
              {({ buildingReopening }) =>
                !buildingReopening &&
                standFirst && (
                  <>
                    <CreamBox>
                      <PageHeaderStandfirst html={standFirst.value} />
                    </CreamBox>
                  </>
                )
              }
            </TogglesContext.Consumer>
          </SpacingSection>
        </Layout10>
        <TogglesContext.Consumer>
          {({ buildingReopening }) =>
            buildingReopening &&
            reopeningList && (
              <SpacingSection>
                {reopeningList.value.title && (
                  <SpacingComponent>
                    <SectionHeader title={reopeningList.value.title} />
                  </SpacingComponent>
                )}
                <SpacingComponent>
                  <SimpleCardGrid
                    items={reopeningList.value.items}
                    isFeaturedFirst={true}
                  />
                </SpacingComponent>
              </SpacingSection>
            )
          }
        </TogglesContext.Consumer>

        {nextSevenDaysEvents.concat(exhibitions).length > 2 && (
          <SpacingSection>
            <SpacingComponent>
              <SectionHeader title="This week" />
            </SpacingComponent>
            <SpacingComponent>
              <ExhibitionsAndEvents
                exhibitions={exhibitions}
                events={nextSevenDaysEvents}
                links={[
                  { text: 'All exhibitions and events', url: '/whats-on' },
                ]}
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
              <SimpleCardGrid items={contentList.value.items} />
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
  }
}

export default HomePage;
