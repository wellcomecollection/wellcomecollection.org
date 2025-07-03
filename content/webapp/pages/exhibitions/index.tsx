import { FunctionComponent } from 'react';

import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { Period } from '@weco/common/types/periods';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchExhibitions } from '@weco/content/services/prismic/fetch/exhibitions';
import { transformExhibitionsQuery } from '@weco/content/services/prismic/transformers/exhibitions';
import { exhibitionLd } from '@weco/content/services/prismic/transformers/json-ld';
import { getPage } from '@weco/content/utils/query-params';
import { cacheTTL, setCacheControl } from '@weco/content/utils/setCacheControl';
import ExhibitionsPage, {
  Props as ExhibitionsPageProps,
} from '@weco/content/views/exhibitions';

const Page: FunctionComponent<ExhibitionsPageProps> = props => {
  return <ExhibitionsPage {...props} />;
};

type Props = ServerSideProps<ExhibitionsPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res, cacheTTL.events);

  const page = getPage(context.query);

  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }

  const client = createClient(context);
  const { period } = context.query;

  const exhibitionsQuery = await fetchExhibitions(client, {
    page,
    period: period as Period,
  });
  const exhibitions = transformExhibitionsQuery(exhibitionsQuery);

  if (isNotUndefined(exhibitions) && exhibitions.results.length > 0) {
    const serverData = await getServerData(context);
    const title = (period === 'past' ? 'Past e' : 'E') + 'xhibitions';
    const jsonLd = exhibitions.results.map(exhibitionLd);

    return {
      props: serialiseProps<Props>({
        exhibitions,
        title,
        period: period as Period,
        jsonLd,
        serverData,
      }),
    };
  }

  return { notFound: true };
};

export default Page;
