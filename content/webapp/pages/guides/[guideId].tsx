import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchGuide } from '@weco/content/services/prismic/fetch/guides';
import { transformGuide } from '@weco/content/services/prismic/transformers/guides';
import { contentLd } from '@weco/content/services/prismic/transformers/json-ld';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import Guide, { Props as PageGuide } from '@weco/content/views/guides/guide';

export const Page: NextPage<PageGuide> = props => {
  return <Guide {...props} />;
};

type Props = ServerSideProps<PageGuide>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const { guideId } = context.query;

  if (!looksLikePrismicId(guideId)) {
    return { notFound: true };
  }

  const client = createClient(context);

  const guideDocument = await fetchGuide(client, guideId);

  if (isNotUndefined(guideDocument)) {
    const guide = transformGuide(guideDocument);
    const serverData = await getServerData(context);

    const jsonLd = contentLd(guide);

    return {
      props: serialiseProps<Props>({
        guide,
        jsonLd,
        serverData,
      }),
    };
  }

  return { notFound: true };
};

export default Page;
