import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import NewsletterPage, {
  Props as NewsletterPageProps,
} from '@weco/content/views/newsletter';

const Page: NextPage<NewsletterPageProps> = props => {
  return <NewsletterPage {...props} />;
};

type Props = ServerSideProps<NewsletterPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);
  const { result } = context.query;

  return {
    props: serialiseProps<Props>({
      result: result ? result.toString() : undefined,
      serverData,
    }),
  };
};

export default Page;
