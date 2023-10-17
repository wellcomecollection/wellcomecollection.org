import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import Head from 'next/head';
import { font } from '@weco/common/utils/classnames';
import SectionHeader from '@weco/content/components/SectionHeader/SectionHeader';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { ArticleBasic } from '@weco/content/types/articles';
import Space from '@weco/common/views/components/styled/Space';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import SimpleCardGrid from '@weco/content/components/SimpleCardGrid/SimpleCardGrid';
import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst/PageHeaderStandfirst';
import {
  orderEventsByNextAvailableDate,
  filterEventsForNext7Days,
} from '@weco/content/services/prismic/events';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { EventBasic } from '@weco/content/types/events';
import { convertItemToCardProps } from '@weco/content/types/card';
import { AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import ExhibitionsAndEvents from '@weco/content/components/ExhibitionsAndEvents/ExhibitionsAndEvents';
import CardGrid from '@weco/content/components/CardGrid/CardGrid';
import { articleLd } from '@weco/content/services/prismic/transformers/json-ld';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchArticles } from '@weco/content/services/prismic/fetch/articles';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import {
  transformArticle,
  transformArticleToArticleBasic,
} from '@weco/content/services/prismic/transformers/articles';
import { homepageId } from '@weco/common/data/hardcoded-ids';
import { fetchPage } from '@weco/content/services/prismic/fetch/pages';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { fetchEvents } from '@weco/content/services/prismic/fetch/events';
import { transformEventBasic } from '@weco/content/services/prismic/transformers/events';
import { pageDescriptions, homepageHeading } from '@weco/common/data/microcopy';
import { fetchExhibitions } from '@weco/content/services/prismic/fetch/exhibitions';
import { transformExhibitionsQuery } from '@weco/content/services/prismic/transformers/exhibitions';
import { ImageType } from '@weco/common/model/image';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import {
  BodySlice,
  isContentList,
  isStandfirst,
} from '@weco/content/types/body';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

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

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
      props: serialiseProps({
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
    <>
      <Head>
        {/*
          Verify our domain name for Meta/Facebook ads.

          This is necessary for brand safety.  Without domain verification, any advertiser
          could run ads that point to our website, and we wouldn't be able to control the
          copy or content of the ad.  Once the domain is verified, only approved partners
          can run ads that point to the Wellcome Collection website.

          Additionally, if we choose to use remarketing at any point, this verification
          will improve the accuracy of our tracking.

          Note: there are two other approaches for domain verification (uploading a file
          to our root domain, or creating a DNS TXT record), but I'm doing it this way
          because modifying HTML is something we do plenty of already, so we're more likely
          to get it right and/or notice if the mechanism has stopped working.

          See https://www.facebook.com/business/help/286768115176155?id=199156230960298
          See https://github.com/wellcomecollection/wellcomecollection.org/issues/9289
        */}
        <meta
          name="facebook-domain-verification"
          content="gl52uu0zshpy3yqv1ohxo3zq39mb0w"
        />
      </Head>
      <PageLayout
        title=""
        description={pageDescriptions.homepage}
        url={{ pathname: '/' }}
        jsonLd={jsonLd}
        openGraphType="website"
        image={pageImage}
        apiToolbarLinks={[createPrismicLink(homepageId)]}
      >
        <Layout10 isCentered={false}>
          <SpacingSection>
            <Space
              v={{ size: 'l', properties: ['margin-top'] }}
              className={font('wb', 1)}
            >
              <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
                <h1>{homepageHeading}</h1>
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
                items={
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  headerList.value.items as any[]
                }
                isFeaturedFirst={true}
              />
            </SpacingComponent>
          </SpacingSection>
        )}

        {nextSevenDaysEvents.length + exhibitions.length > 0 && (
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
              <SectionHeader title={contentList.value.title || ''} />
            </SpacingComponent>
            <SpacingComponent>
              <SimpleCardGrid
                items={
                  contentList.value.items.map(
                    item =>
                      item.type === 'seasons'
                        ? convertItemToCardProps(item)
                        : item
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    </>
  );
};

export default Homepage;
