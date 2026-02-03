import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import WorksPrototypePage, {
  Props as WorksPrototypePageProps,
} from '@weco/content/views/pages/search/prototype-works';

const Page: NextPage<WorksPrototypePageProps> = props => {
  return <WorksPrototypePage {...props} />;
};

type Props = ServerSideProps<WorksPrototypePageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  const serverData = await getServerData(context);

  return {
    props: serialiseProps<Props>({
      serverData,
      query: { query: 'cancer' }, // Default prototype query
    }),
  };
};

export default Page;
