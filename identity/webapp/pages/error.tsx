import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import ErrorPage, {
  Props as ErrorPageProps,
} from '@weco/identity/views/pages/error';

const Page: NextPage<ErrorPageProps> = props => {
  return <ErrorPage {...props} />;
};

type Props = ServerSideProps<ErrorPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  const serverData = await getServerData(context);
  const { query } = context;
  const errorDescription = Array.isArray(query.error_description)
    ? query.error_description[0]
    : query.error_description;

  return {
    props: serialiseProps<Props>({
      serverData,
      errorDescription: errorDescription || 'Error',
    }),
  };
};

export default Page;
