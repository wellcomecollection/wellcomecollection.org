import { GetServerSideProps } from 'next';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import Space from '@weco/common/views/components/styled/Space';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { getSearchLayout } from 'components/SearchPageLayout/SearchPageLayout';
import {
  getStories,
  PrismicQueryProps,
} from '../../services/prismic/fetch/articles';
import { Story } from '../../services/prismic/types/story';
import { PrismicResultsList } from '../../services/prismic/types';

type Props = {
  storyResponseList: PrismicResultsList<Story>;
};

export const SearchPage: NextPageWithLayout<Props> = ({
  storyResponseList,
}) => {
  return (
    <div className="container">
      <h1 className="visually-hidden">Stories Search Page</h1>
      <Space v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}>
        <div>Stories content</div>
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
            <summary>THE STORIES</summary>
            {/* eslint-disable-next-line no-restricted-syntax */}
            {JSON.stringify(storyResponseList, null, 1)}
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

  const storyResponseList = await getStories({
    query,
    pageSize: 5,
  } as PrismicQueryProps);

  return {
    props: removeUndefinedProps({
      serverData,
      storyResponseList,
    }),
  };
};

export default SearchPage;
