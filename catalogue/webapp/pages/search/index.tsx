import { GetServerSideProps } from 'next';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import Space from '@weco/common/views/components/styled/Space';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { getSearchLayout } from 'components/SearchPageLayout/SearchPageLayout';
import { Pageview } from '@weco/common/services/conversion/track';

type Props = {
  pageview: Pageview;
};

export const SearchPage: NextPageWithLayout<Props> = () => {
  return (
    <div className="container">
      <h1 className="visually-hidden">Overview Search Page</h1>
      <Space v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}>
        <div>Overview</div>
      </Space>
    </div>
  );
};

SearchPage.getLayout = getSearchLayout;

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);

    if (!serverData.toggles.searchPage) {
      return { notFound: true };
    }

    return {
      props: removeUndefinedProps({
        serverData,
        // TODO Harrison to explore what properties we'd want here
        pageview: {
          name: 'search',
          properties: {},
        },
      }),
    };
  };

export default SearchPage;
