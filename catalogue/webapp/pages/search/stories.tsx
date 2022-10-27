import { GetServerSideProps } from 'next';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import Space from '@weco/common/views/components/styled/Space';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { getSearchLayout } from 'components/SearchPageLayout/SearchPageLayout';
import { getArticle, getArticles } from '../../services/prismic';

type Props = {
  storyResponse;
  storyResponseList;
};

export const SearchPage: NextPageWithLayout<Props> = ({
  storyResponseList,
  storyResponse,
}) => {
  return (
    <>
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
            {console.log('storyResponse', storyResponseList)}
            {JSON.stringify(storyResponseList, null, 1)}
          </details>
        </code>
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
            <summary>A STORY</summary>
            {/* eslint-disable-next-line no-restricted-syntax */}
            {JSON.stringify(storyResponse, null, 1)}
          </details>
        </code>
      </pre>
    </>
  );
};

SearchPage.getLayout = getSearchLayout;

export const getServerSideProps: GetServerSideProps<
  Record<string, unknown> | AppErrorProps
> = async context => {
  const serverData = await getServerData(context);
  const { query } = context;
  const finalQuery = query.toString();

  if (!serverData.toggles.searchPage) {
    return { notFound: true };
  }

  const storyResponseList = await getArticles({
    query: finalQuery,
    pageSize: 5,
  });

  const storyResponse = await getArticle({ id: 'YxWwaBEAACEAi5jI' });


  return {
    props: removeUndefinedProps({
      serverData,
      storyResponse,
      storyResponseList,
    }),
  };
};

export default SearchPage;
