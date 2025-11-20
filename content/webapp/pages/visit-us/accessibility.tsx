import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { useToggles } from '@weco/common/server-data/Context';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import * as page from '@weco/content/pages/pages/[pageId]';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import A11yPrototypePage from '@weco/content/views/pages/about-us/prototype-a11y-november-2025';

const Page: NextPage<page.Props> = props => {
  const { a11yPrototype } = useToggles();

  return a11yPrototype ? (
    <A11yPrototypePage {...props} />
  ) : (
    <page.Page {...props} />
  );
};

type Props = ServerSideProps<page.Props>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  return page.getServerSideProps({
    ...context,
    query: {
      pageId: !serverData.toggles.a11yPrototype.value
        ? 'accessibility'
        : 'prototype-a11y-november-2025',
    },
    params: { siteSection: 'visit-us' },
  });
};

export default Page;
