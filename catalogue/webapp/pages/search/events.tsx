import { GetServerSideProps } from 'next';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import Space from '@weco/common/views/components/styled/Space';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { getLayout } from 'components/SearchPageLayout/SearchPageLayout';

export const SearchPage: NextPageWithLayout = () => {
  return (
    <>
      <h1 className="visually-hidden">Events Search Page</h1>
      <Space v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}>
        <div>Events content</div>
      </Space>
    </>
  );
};

SearchPage.getLayout = getLayout;

export const getServerSideProps: GetServerSideProps<
  Record<string, unknown> | AppErrorProps
> = async context => {
  const serverData = await getServerData(context);

  if (!serverData.toggles.searchPage) {
    return { notFound: true };
  }

  return {
    props: removeUndefinedProps({
      serverData,
    }),
  };
};

export default SearchPage;
