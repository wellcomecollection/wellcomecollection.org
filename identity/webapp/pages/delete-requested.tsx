import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import DeleteRequestedPage from '@weco/identity/views/pages/delete-requested';

const Page: NextPage = props => {
  return <DeleteRequestedPage {...props} />;
};

export const getServerSideProps: ServerSidePropsOrAppError<
  ServerSideProps
> = async context => {
  const serverData = await getServerData(context);

  return {
    props: serialiseProps<ServerSideProps>({
      serverData,
    }),
  };
};

export default Page;
