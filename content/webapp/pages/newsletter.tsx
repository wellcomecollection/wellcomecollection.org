import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { getServerData } from '@weco/common/server-data';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import NewsletterPage, {
  Props as NewsletterPageProps,
} from '@weco/content/views/static/newsletter';

type Props = NewsletterPageProps & {
  serverData: SimplifiedServerData; // TODO should we enforce this?
};

const Page: FunctionComponent<NewsletterPageProps> = props => {
  return <NewsletterPage {...props} />;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
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
