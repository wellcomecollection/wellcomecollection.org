import { GetServerSidePropsContext, NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import SuccessPage, {
  Props as SuccessPageProps,
} from '@weco/identity/views/pages/success';

const Page: NextPage<SuccessPageProps> = props => {
  return <SuccessPage {...props} />;
};

type Props = ServerSideProps<SuccessPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<Props> = async (
  context: GetServerSidePropsContext
) => {
  const serverData = await getServerData(context);

  const { email } = context.query;

  return {
    props: serialiseProps<Props>({
      serverData,
      email: email as string,
    }),
  };
};

export default Page;
