import { GetServerSideProps } from 'next';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import Space from '@weco/common/views/components/styled/Space';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { getSearchLayout } from '@weco/catalogue/components/SearchPageLayout/SearchPageLayout';
import {
  getExhibitions,
  PrismicQueryProps,
} from '@weco/catalogue/services/prismic/fetch/exhibitions';
import { Exhibition } from '@weco/catalogue/services/prismic/types/exhibition';
import { PrismicResultsList } from '@weco/catalogue/services/prismic/types';
import { Pageview } from '@weco/common/services/conversion/track';
import styled from 'styled-components';
import SearchPagination from '@weco/common/views/components/SearchPagination/SearchPagination';
import { font } from '@weco/common/utils/classnames';

type Props = {
  exhibitionResponseList: PrismicResultsList<Exhibition>;
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

const ExhibitionCardWrapper = styled.article`
  width: 382px;
  height: 100%;
  background: #efede3;
  border-radius: 8px;

  img {
    border-radius: 8px 8px 0 0;
  }
`;

const ExhibitionCardMetaWrapper = styled.div`
  padding: 15px 15px 24px;
  max-height: 250px;
  text-overflow: ellipsis;
`;

const ExhibitionCardTitle = styled.h2`
  font-size: 20px;
`;

const ExhibitionCardTypesBadgeWrapper = styled.div`
  display: felx;
`;
const ExhibitionCardTypesBadge = styled.div`
  font-size: 14px;
  padding: 0 4px;
  background: #ffce3c;
`;

const ExhibitionCardSummary = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

type ExhibitionCardProps = {
  image?: { url: string };
  title: string;
  type: string[];
  url: string;
  summary: string;
};

const ExhibitionCard = ({
  title,
  image,
  type,
  url,
  summary,
}: ExhibitionCardProps) => {
  return (
    <a style={{ textDecoration: 'none' }} href={url}>
      <ExhibitionCardWrapper>
        <div>
          <img src={image ? image.url : ''} alt="" />
        </div>
        <ExhibitionCardMetaWrapper>
          <ExhibitionCardTypesBadgeWrapper>
            {type.map(type => (
              <ExhibitionCardTypesBadge key={type}>
                {type}
              </ExhibitionCardTypesBadge>
            ))}
          </ExhibitionCardTypesBadgeWrapper>
          <ExhibitionCardTitle>{title}</ExhibitionCardTitle>
          <ExhibitionCardSummary>{summary}</ExhibitionCardSummary>
        </ExhibitionCardMetaWrapper>
      </ExhibitionCardWrapper>
    </a>
  );
};

const ExhibitionCardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 30px;
  margin-bottom: 160px;
`;

export const SearchPage: NextPageWithLayout<Props> = ({
  exhibitionResponseList,
}) => {
  return (
    <div className="container">
      <h1 className="visually-hidden">Exhibitions Search Page</h1>
      <PaginationWrapper aria-label="Sort Search Results">
        {exhibitionResponseList.totalResults > 0 && (
          <div>{exhibitionResponseList.totalResults} results</div>
        )}
        <SearchPagination totalPages={exhibitionResponseList?.totalPages} />
      </PaginationWrapper>
      <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
        {exhibitionResponseList.totalResults > 0 && (
          <ExhibitionCardsWrapper>
            {exhibitionResponseList.results.map(exhibition => (
              <ExhibitionCard key={exhibition.id} {...exhibition} />
            ))}
          </ExhibitionCardsWrapper>
        )}
      </Space>
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

  const exhibitionResponseList = await getExhibitions({
    query,
    pageSize: 5,
  } as PrismicQueryProps);

  return {
    props: removeUndefinedProps({
      exhibitionResponseList,
      serverData,
      pageview: {
        name: 'exhibitions',
        properties:
          exhibitionResponseList?.type === 'ResultList'
            ? { totalResults: exhibitionResponseList.totalResults }
            : {},
      },
    }),
  };
};

export default SearchPage;
