import { GetServerSideProps } from 'next';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import Space from '@weco/common/views/components/styled/Space';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { getSearchLayout } from '@weco/catalogue/components/SearchPageLayout/SearchPageLayout';
import {
  getEvents,
  PrismicQueryProps,
} from '../../services/prismic/fetch/events';
import { Event } from '../../services/prismic/types/event';
import { PrismicResultsList } from '../../services/prismic/types';
import { Pageview } from '@weco/common/services/conversion/track';

import SearchPagination from '@weco/common/views/components/SearchPagination/SearchPagination';
import { font } from '@weco/common/utils/classnames';
import styled from 'styled-components';

type Props = {
  eventResponseList: PrismicResultsList<Event>;
  pageview: Pageview;
};

const PaginationWrapper = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  className: font('intb', 5),
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const EventCardWrapper = styled.article`
  width: 382px;
  background: #efede3;
  border-radius: 8px;

  img {
    border-radius: 8px 8px 0 0;
  }
`;

const EventCardMetaWrapper = styled.div`
  padding: 15px 15px 24px;
`;

const EventCardTitle = styled.h2`
  font-size: 20px;
`;

const EventCardTypesBadgeWrapper = styled.div`
  display: felx;
`;
const EventCardTypesBadge = styled.div`
  font-size: 14px;
  padding: 0 4px;
  background: #ffce3c;
`;

type EventCardProps = {
  image?: { url: string };
  title: string;
  type: string[];
};

const EventCard = ({ title, image, type }: EventCardProps) => {
  return (
    <EventCardWrapper>
      <div>
        <img src={image ? image.url : ''} alt="" />
      </div>
      <EventCardMetaWrapper>
        <EventCardTypesBadgeWrapper>
          {type.map(type => (
            <EventCardTypesBadge key={type}>{type}</EventCardTypesBadge>
          ))}
        </EventCardTypesBadgeWrapper>
        <EventCardTitle>{title}</EventCardTitle>
        <div>location</div>
        <div>date and time</div>
        <div>a11y info</div>
      </EventCardMetaWrapper>
    </EventCardWrapper>
  );
};

const EventCardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 40px;
`;

export const SearchPage: NextPageWithLayout<Props> = ({
  eventResponseList,
}) => {
  console.log(eventResponseList);
  return (
    <div className="container">
      <h1 className="visually-hidden">Events Search Page</h1>
      <PaginationWrapper aria-label="Sort Search Results">
        {eventResponseList.totalResults > 0 && (
          <div>{eventResponseList.totalResults} results</div>
        )}
        <SearchPagination totalPages={eventResponseList?.totalPages} />
      </PaginationWrapper>
      {eventResponseList.totalResults > 0 && (
        <EventCardsWrapper>
          {eventResponseList.results.map(event => (
            <EventCard key={event.id} {...event} />
          ))}
        </EventCardsWrapper>
      )}
      <pre
        style={{
          maxWidth: '600px',
          margin: '0 auto 24px',
          fontSize: '14px',
        }}
      >
        <code
          style={{
            display: 'block',
            padding: '24px',
            backgroundColor: '#EFE1AA',
            color: '#000',
            border: '4px solid #000',
            borderRadius: '6px',
          }}
        >
          <details>
            <summary>THE EVENTS</summary>
            {/* eslint-disable-next-line no-restricted-syntax */}
            {JSON.stringify(eventResponseList, null, 1)}
          </details>
        </code>
      </pre>
    </div>
  );
};

SearchPage.getLayout = getSearchLayout;

export const getServerSideProps: GetServerSideProps<
  Record<string, unknown> | AppErrorProps
> = async context => {
  const serverData = await getServerData(context);
  const { query } = context.query;

  if (!serverData.toggles.searchPage) {
    return { notFound: true };
  }

  const eventResponseList = await getEvents({
    query,
    pageSize: 5,
  } as PrismicQueryProps);

  return {
    props: removeUndefinedProps({
      serverData,
      eventResponseList,
      pageview: {
        name: 'events',
        properties:
          eventResponseList?.type === 'ResultList'
            ? { totalResults: eventResponseList.totalResults }
            : {},
      },
    }),
  };
};

export default SearchPage;
