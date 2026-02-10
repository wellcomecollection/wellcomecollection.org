import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { fetchShopProducts } from '@weco/content/services/shopify';
import { getPage } from '@weco/content/utils/query-params';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import ShopPage, {
  Props as ShopPageProps,
} from '@weco/content/views/pages/shop';

const Page: NextPage<ShopPageProps> = props => {
  return <ShopPage {...props} />;
};

type Props = ServerSideProps<ShopPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const page = getPage(context.query);

  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }

  const products = await fetchShopProducts({ page, pageSize: 21 });
  const serverData = await getServerData(context);

  return {
    props: serialiseProps<Props>({
      products,
      serverData,
    }),
  };
};

export default Page;
