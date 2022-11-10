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

type Props = {
  exhibitionResponseList: PrismicResultsList<Exhibition>;
  pageview: Pageview;
};

export const SearchPage: NextPageWithLayout<Props> = ({
  exhibitionResponseList,
}) => {
  return (
    <div className="container">
      <h1 className="visually-hidden">Exhibitions Search Page</h1>
      <Space v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}>
        <div>Exhibition content</div>
      </Space>
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
            <summary>THE EXHIBITIONS</summary>
            {/* eslint-disable-next-line no-restricted-syntax */}
            {JSON.stringify(exhibitionResponseList, null, 1)}
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
