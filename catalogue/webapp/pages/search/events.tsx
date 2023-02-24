import { GetServerSideProps } from 'next';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import { NextPageWithLayout } from '@weco/common/views/pages/_app';
import { getSearchLayout } from '@weco/catalogue/components/SearchPageLayout/SearchPageLayout';

import { Pageview } from '@weco/common/services/conversion/track';
import SearchNoResults from '@weco/catalogue/components/SearchNoResults/SearchNoResults';

type Props = {
  pageview: Pageview;
};

export const SearchPage: NextPageWithLayout<Props> = () => {
  return (
    <div className="container">
      <SearchNoResults query="" />
    </div>
  );
};

SearchPage.getLayout = getSearchLayout;

export const getServerSideProps: GetServerSideProps<
  Record<string, unknown> | AppErrorProps
> = async context => {
  const serverData = await getServerData(context);

  if (!serverData.toggles.searchPageEventsExhibitions) {
    return { notFound: true };
  }

  return {
    props: removeUndefinedProps({
      serverData,
      pageview: {
        name: 'events',
        properties: {},
      },
    }),
  };
};

export default SearchPage;
