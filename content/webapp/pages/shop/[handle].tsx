import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import { isString } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { fetchShopProduct } from '@weco/content/services/shopify';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import ShopProductPage, {
  Props as ShopProductPageProps,
} from '@weco/content/views/pages/shop/product';

const Page: NextPage<ShopProductPageProps> = props => {
  return <ShopProductPage {...props} />;
};

type Props = ServerSideProps<ShopProductPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const { handle } = context.query;

  if (!isString(handle)) {
    return { notFound: true };
  }

  const product = await fetchShopProduct(handle);

  if (!product) {
    return { notFound: true };
  }

  const serverData = await getServerData(context);

  return {
    props: serialiseProps<Props>({
      product,
      serverData,
    }),
  };
};

export default Page;
