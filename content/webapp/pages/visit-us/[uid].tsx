import { NextPage } from 'next';

import { looksLikePrismicId } from '@weco/common/services/prismic';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import * as page from '@weco/content/pages/pages/[pageId]';

const Page: NextPage<page.Props> = props => {
  return <page.Page {...props} />;
};

type Props = ServerSideProps<page.Props>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  const { uid } = context.query;

  // a11yPrototype page to be blocked from this path
  if (
    !looksLikePrismicId(uid) ||
    ['prototype-a11y-november-2025', 'aR3wwBAAACYAZt2l'].includes(uid)
  ) {
    return { notFound: true };
  }

  return page.getServerSideProps({
    ...context,
    query: { pageId: uid },
    params: { siteSection: 'visit-us' },
  });
};

export default Page;
