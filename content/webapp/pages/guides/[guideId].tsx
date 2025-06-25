import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/services/app';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchGuide } from '@weco/content/services/prismic/fetch/guides';
import { transformGuide } from '@weco/content/services/prismic/transformers/guides';
import { contentLd } from '@weco/content/services/prismic/transformers/json-ld';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import Guide, { Props } from '@weco/content/views/guides/guide';

export const Page: FunctionComponent<Props> = props => {
  return <Guide guide={props.guide} jsonLd={props.jsonLd} />;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
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
      props: serialiseProps({
        guide,
        jsonLd,
        serverData,
      }),
    };
  }

  return { notFound: true };
};

export default Page;
