import * as prismic from '@prismicio/client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { homepageId, prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { homepageHeading, pageDescriptions } from '@weco/common/data/microcopy';
import { ImageType } from '@weco/common/model/image';
import {
  PagesDocument as RawPagesDocument,
  StandfirstSlice as RawStandfirstSlice,
} from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/services/app';
import { font } from '@weco/common/utils/classnames';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import {
  ContaineredLayout,
  gridSize10,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageLayout from '@weco/common/views/components/PageLayout';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import Standfirst from '@weco/common/views/slices/Standfirst';
import CardGrid from '@weco/content/components/CardGrid';
import ExhibitionsAndEvents from '@weco/content/components/ExhibitionsAndEvents';
import SectionHeader from '@weco/content/components/SectionHeader';
import SimpleCardGrid from '@weco/content/components/SimpleCardGrid';
import {
  filterEventsForNext7Days,
  orderEventsByNextAvailableDate,
} from '@weco/content/services/prismic/events';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchEvents } from '@weco/content/services/prismic/fetch/events';
import { fetchExhibitions } from '@weco/content/services/prismic/fetch/exhibitions';
import { fetchPage } from '@weco/content/services/prismic/fetch/pages';
import { transformContentListSlice } from '@weco/content/services/prismic/transformers/body';
import { transformEventBasic } from '@weco/content/services/prismic/transformers/events';
import { transformExhibitionsQuery } from '@weco/content/services/prismic/transformers/exhibitions';
import { articleLdContentApi } from '@weco/content/services/prismic/transformers/json-ld';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { getArticles } from '@weco/content/services/wellcome/content/articles';
import { Article } from '@weco/content/services/wellcome/content/types/api';
import {
  ContentListProps,
  isContentList,
  Slice,
} from '@weco/content/types/body';
import { convertItemToCardProps } from '@weco/content/types/card';
import { EventBasic } from '@weco/content/types/events';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

const CreamBox = styled(Space).attrs({
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background: ${props => props.theme.color('warmNeutral.300')};
`;

type Props = {
  pageId: string;
  exhibitions: ExhibitionBasic[];
  nextSevenDaysEvents: EventBasic[];
  articles: Article[];
  jsonLd: JsonLdObj[];
  untransformedStandfirst?: RawStandfirstSlice;
  transformedHeaderList: Slice<'contentList', ContentListProps> | null;
  transformedContentList: Slice<'contentList', ContentListProps>;
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

  const articlesResponsePromise = getArticles({
    params: {},
    pageSize: 4,
    toggles: serverData.toggles,
  });

  const eventsQueryPromise = fetchEvents(client, {
    period: 'current-and-coming-up',
  });
  const pagePromise = fetchPage(client, homepageId);
  const exhibitionsQueryPromise = fetchExhibitions(client, {
    period: 'next-seven-days',
    order: 'asc',
  });

  const [articlesResponse, exhibitionsQuery, eventsQuery, pageDocument] =
    await Promise.all([
      articlesResponsePromise,
      exhibitionsQueryPromise,
      eventsQueryPromise,
      pagePromise,
    ]);

  // The homepage should always exist in Prismic.
  const page = transformPage(pageDocument as RawPagesDocument);

  const articles =
    articlesResponse.type === 'ResultList' ? articlesResponse.results : [];

  const jsonLd = articles.map(articleLdContentApi);

  const events = transformQuery(eventsQuery, transformEventBasic).results;
  const nextSevenDaysEvents = orderEventsByNextAvailableDate(
    filterEventsForNext7Days(events)
  );

  const exhibitions = transformExhibitionsQuery(exhibitionsQuery).results;

  const untransformedBody = pageDocument?.data.body || [];
  const untransformedStandfirst = untransformedBody.find(
    (slice: prismic.Slice) => slice.slice_type === 'standfirst'
  ) as RawStandfirstSlice | undefined;
  const contentLists = page.untransformedBody.filter(isContentList);

  const headerList = contentLists.length === 2 ? contentLists[0] : null;
  const transformedHeaderList =
    headerList && transformContentListSlice(headerList);
  const headerListIds: Set<string> = transformedHeaderList
    ? new Set(
        transformedHeaderList.value.items.map(v => v.id).filter(isNotUndefined)
      )
    : new Set();

  const contentList =
    contentLists.length === 2 ? contentLists[1] : contentLists[0];
  const transformedContentList =
    contentList && transformContentListSlice(contentList);

  if (events && exhibitions && articles && page) {
    return {
      props: serialiseProps({
        pageId: page.id,
        articles,
        serverData,
        jsonLd,
        untransformedStandfirst,
        transformedHeaderList,
        transformedContentList,
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
  untransformedStandfirst,
  transformedHeaderList,
  transformedContentList,
  pageId,
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
        apiToolbarLinks={[createPrismicLink(pageId)]}
      >
        <ContaineredLayout gridSizes={gridSize10(false)}>
          <SpacingSection>
            <Space
              $v={{ size: 'l', properties: ['margin-top'] }}
              className={font('wb', 1)}
            >
              <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
                <h1>{homepageHeading}</h1>
              </Space>
            </Space>

            {untransformedStandfirst && (
              <CreamBox>
                <Standfirst
                  slice={untransformedStandfirst}
                  index={0}
                  context={{}}
                  slices={[]}
                />{' '}
              </CreamBox>
            )}
          </SpacingSection>
        </ContaineredLayout>
        {transformedHeaderList && (
          <SpacingSection>
            {transformedHeaderList.value.title && (
              <SpacingComponent>
                <SectionHeader
                  title={transformedHeaderList.value.title}
                  gridSize={gridSize12()}
                />
              </SpacingComponent>
            )}
            <SpacingComponent>
              <SimpleCardGrid
                items={
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  transformedHeaderList.value.items as any[]
                }
                isFeaturedFirst={true}
              />
            </SpacingComponent>
          </SpacingSection>
        )}

        {nextSevenDaysEvents.length + exhibitions.length > 0 && (
          <SpacingSection>
            <SpacingComponent>
              <SectionHeader title="This week" gridSize={gridSize12()} />
            </SpacingComponent>
            <SpacingComponent>
              <ExhibitionsAndEvents
                exhibitions={exhibitions}
                events={nextSevenDaysEvents}
                links={[
                  {
                    text: 'All exhibitions and events',
                    url: `/${prismicPageIds.whatsOn}`,
                  },
                ]}
              />
            </SpacingComponent>
          </SpacingSection>
        )}

        {transformedContentList && (
          <SpacingSection>
            <SpacingComponent>
              <SectionHeader
                title={transformedContentList.value.title || ''}
                gridSize={gridSize12()}
              />
            </SpacingComponent>
            <SpacingComponent>
              <SimpleCardGrid
                items={
                  transformedContentList.value.items.map(
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
            <SectionHeader title="Latest stories" gridSize={gridSize12()} />
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
