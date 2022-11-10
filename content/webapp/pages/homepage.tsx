import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { ArticleBasic } from '../types/articles';
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
import { AppErrorProps } from '@weco/common/services/app';
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
import { homepageId } from '@weco/common/data/hardcoded-ids';
import { fetchPage } from '../services/prismic/fetch/pages';
import { transformPage } from '../services/prismic/transformers/pages';
import { fetchEvents } from '../services/prismic/fetch/events';
import {
  transformEvent,
  transformEventBasic,
} from '../services/prismic/transformers/events';
import { pageDescriptions, homepageHeading } from '@weco/common/data/microcopy';
import { fetchExhibitions } from '../services/prismic/fetch/exhibitions';
import { transformExhibitionsQuery } from '../services/prismic/transformers/exhibitions';
import { ImageType } from '@weco/common/model/image';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { BodySlice, isContentList, isStandfirst } from 'types/body';
import { isNotUndefined } from '@weco/common/utils/array';

const CreamBox = styled(Space).attrs({
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background: ${props => props.theme.color('warmNeutral.300')};
`;

type Props = {
  exhibitions: ExhibitionBasic[];
  nextSevenDaysEvents: EventBasic[];
  articles: ArticleBasic[];
  jsonLd: JsonLdObj[];
  standfirst?: BodySlice & { type: 'standfirst' };
  headerList: (BodySlice & { type: 'contentList' }) | null;
  contentList: BodySlice & { type: 'contentList' };
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

    const events = transformQuery(eventsQuery, transformEventBasic).results;
    const nextSevenDaysEvents = orderEventsByNextAvailableDate(
      filterEventsForNext7Days(events)
    );

    const exhibitions = transformExhibitionsQuery(exhibitionsQuery).results;

    const standfirst = page.body.find(isStandfirst);
    const contentLists = page.body.filter(isContentList);

    const headerList = contentLists.length === 2 ? contentLists[0] : null;

    const headerListIds: Set<string> = headerList
      ? new Set(headerList.value.items.map(v => v.id).filter(isNotUndefined))
      : new Set();

    const contentList =
      contentLists.length === 2 ? contentLists[1] : contentLists[0];

    if (events && exhibitions && articles && page) {
      return {
        props: removeUndefinedProps({
          articles: basicArticles,
          serverData,
          jsonLd,
          standfirst,
          headerList,
          contentList,
          // If an exhibition or event appears in the header, we don't want
          // to display it a second time in the list of what's on.
          exhibitions: exhibitions.filter(ex => !headerListIds.has(ex.id)),
          nextSevenDaysEvents: nextSevenDaysEvents.filter(
            ev => !headerListIds.has(ev.id)
          ),
        }),
      };
    } else {
      return { notFound: true };
    }
  };

const Homepage: FunctionComponent<Props> = ({
  nextSevenDaysEvents,
  exhibitions,
  articles,
  jsonLd,
  standfirst,
  headerList,
  contentList,
}) => {
  return (
    <PageLayout
      title=""
      description={pageDescriptions.homepage}
      url={{ pathname: '/' }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection={null}
      image={pageImage}
    >
      <Layout10 isCentered={false}>
        <SpacingSection>
          <Space
            v={{ size: 'l', properties: ['margin-top'] }}
            className={font('wb', 1)}
          >
            <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
              <h1 className="no-margin">{homepageHeading}</h1>
            </Space>
          </Space>
          {standfirst && (
            <CreamBox>
              <PageHeaderStandfirst html={standfirst.value} />
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
              events={nextSevenDaysEvents}
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
                contentList.value.items.map(item =>
                  item.type === 'seasons' ? convertItemToCardProps(item) : item
                ) as any[]
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
